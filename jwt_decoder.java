// jwt_decoder.java — Java версия

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Header;
import java.util.Date;
import java.util.Map;

public class jwt_decoder {
    public static void main(String[] args) {
        if (args.length < 1) {
            System.err.println("Usage: java jwt_decoder <token>");
            System.exit(1);
        }
        String token = args[0];

        try {
            // Декодируем без проверки подписи
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey("".getBytes()) // dummy
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            Header header = Jwts.parserBuilder().setSigningKey("".getBytes()).build().parseClaimsJws(token).getHeader();

            System.out.println("\uD83D\uDD10 JWT Decoder (Java)");
            System.out.println("---------------------------");
            System.out.println("Header: " + header);
            System.out.println("Payload: " + claims);

            // Проверка срока
            Date exp = claims.getExpiration();
            if (exp != null) {
                Date now = new Date();
                if (exp.after(now)) {
                    long diff = exp.getTime() - now.getTime();
                    long days = diff / (1000*60*60*24);
                    long hours = (diff % (1000*60*60*24)) / (1000*60*60);
                    long mins = (diff % (1000*60*60)) / (1000*60);
                    System.out.println("✅ Действителен, осталось: " + days + " дн, " + hours + " ч, " + mins + " мин");
                } else {
                    long diff = now.getTime() - exp.getTime();
                    long days = diff / (1000*60*60*24);
                    long hours = (diff % (1000*60*60*24)) / (1000*60*60);
                    long mins = (diff % (1000*60*60)) / (1000*60);
                    System.out.println("❌ Просрочен на: " + days + " дн, " + hours + " ч, " + mins + " мин");
                }
            } else {
                System.out.println("⏳ Поле exp отсутствует");
            }
            // алгоритм из заголовка
            System.out.println("Алгоритм: " + header.get("alg"));
        } catch (Exception e) {
            System.err.println("Ошибка: " + e.getMessage());
        }
    }
}
