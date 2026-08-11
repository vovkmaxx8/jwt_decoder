// jwt_decoder.rs — Rust версия

use jsonwebtoken::{decode, decode_header, Algorithm, DecodingKey, Validation};
use serde_json::Value;
use chrono::{DateTime, Utc, Duration};
use std::env;
use colored::*;

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        eprintln!("Usage: cargo run -- <token>");
        std::process::exit(1);
    }
    let token = &args[1];

    // Декодируем заголовок и полезную нагрузку без проверки
    let header = decode_header(token).expect("Неверный токен");
    let token_data = decode::<Value>(token, &DecodingKey::from_secret("".as_ref()), &Validation::new(Algorithm::HS256))
        .unwrap_or_else(|e| {
            // Если не удалось проверить, всё равно покажем payload (при ошибке парсим заново)
            // Для простоты используем decode без проверки
            let val = jsonwebtoken::decode::<Value>(token, &DecodingKey::from_secret(b""), &Validation::new(Algorithm::HS256))
                .unwrap_or_else(|_| panic!("Не удалось декодировать"));
            val
        });

    let payload = token_data.claims;
    let header_json = serde_json::to_string_pretty(&header).unwrap();
    let payload_json = serde_json::to_string_pretty(&payload).unwrap();

    println!("{}", "🔐 JWT Decoder (Rust)".cyan());
    println!("----------------------------");
    println!("{}", format!("Header: {}", header_json).yellow());
    println!("{}", format!("Payload: {}", payload_json).green());

    // Проверка exp
    if let Some(exp) = payload.get("exp").and_then(|v| v.as_i64()) {
        let exp_time = DateTime::from_timestamp(exp, 0).unwrap();
        let now = Utc::now();
        if exp_time > now {
            let diff = exp_time - now;
            println!("{}", format!("✅ Действителен, осталось: {} дн, {} ч, {} мин", diff.num_days(), diff.num_hours() % 24, diff.num_minutes() % 60).green());
        } else {
            let diff = now - exp_time;
            println!("{}", format!("❌ Просрочен на: {} дн, {} ч, {} мин", diff.num_days(), diff.num_hours() % 24, diff.num_minutes() % 60).red());
        }
    } else {
        println!("{}", "⏳ Поле exp отсутствует".yellow());
    }
    println!("Алгоритм: {}", header.alg);
}
