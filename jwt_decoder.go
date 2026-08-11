// jwt_decoder.go — Go версия

package main

import (
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: go run jwt_decoder.go <token>")
		os.Exit(1)
	}
	tokenString := os.Args[1]

	// Парсим без проверки подписи, чтобы получить claims
	parser := jwt.Parser{SkipClaimsValidation: true}
	token, _, err := parser.ParseUnverified(tokenString, jwt.MapClaims{})
	if err != nil {
		fmt.Printf("Ошибка: %v\n", err)
		os.Exit(1)
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		fmt.Println("Не удалось получить claims")
		os.Exit(1)
	}

	// Выводим красиво
	fmt.Println("🔐 JWT Decoder (Go)")
	fmt.Println("--------------------")
	header, _ := json.MarshalIndent(token.Header, "", "  ")
	fmt.Printf("Header: %s\n", header)
	payload, _ := json.MarshalIndent(claims, "", "  ")
	fmt.Printf("Payload: %s\n", payload)

	// Проверка exp
	if exp, ok := claims["exp"]; ok {
		switch v := exp.(type) {
		case float64:
			expTime := time.Unix(int64(v), 0)
			now := time.Now()
			if expTime.After(now) {
				diff := expTime.Sub(now)
				fmt.Printf("✅ Действителен, осталось: %v\n", diff.Round(time.Second))
			} else {
				diff := now.Sub(expTime)
				fmt.Printf("❌ Просрочен на %v\n", diff.Round(time.Second))
			}
		default:
			fmt.Println("⏳ Поле exp не числовое")
		}
	} else {
		fmt.Println("⏳ Поле exp отсутствует")
	}
	fmt.Printf("Алгоритм: %s\n", token.Header["alg"])
}
