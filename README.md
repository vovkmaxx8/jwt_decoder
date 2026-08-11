# 🔐 JWT Decoder Pro — твой самый честный друг в мире токенов

> «Токен есть, а срока нет?» — мы проверим.

**JWT Decoder Pro** — это многоязычный набор утилит для анализа и валидации JWT-токенов.  
Главная задача — быстро показать, жив ли токен, когда он истечёт, и что там внутри.

## 🚀 Особенности
- 📅 **Проверка срока действия** (exp) — покажет оставшееся время или «токен просрочен».
- 🔍 **Декодирование payload** — выводит все заявленные данные (субъект, роли, прочее).
- 🛡️ **Проверка алгоритма** и сигнатуры (где библиотеки позволяют).
- 🎨 **Цветной вывод** в терминале для быстрой ориентации.
- ⚡ **Поддержка нескольких токенов** — можно проверить пачку за раз.
- 🌍 **8 языков программирования** — бери любой, какой любишь.

## 🛠️ Установка и запуск

Каждый скрипт — самодостаточный. Убедитесь, что установлены зависимости.

| Язык       | Зависимости                 | Команда запуска                      |
|------------|-----------------------------|--------------------------------------|
| Python     | `pyjwt`, `colorama`         | `python jwt_decoder.py <token>`      |
| JavaScript | `jsonwebtoken`              | `node jwt_decoder.js <token>`        |
| Go         | `golang-jwt`                | `go run jwt_decoder.go <token>`      |
| Java       | `jjwt` (Maven/Gradle)       | `javac ... && java ...`              |
| C#         | `System.IdentityModel.Tokens.Jwt` | `dotnet run`                    |
| Rust       | `jsonwebtoken`, `serde`     | `cargo run -- <token>`               |
| Ruby       | `jwt` gem                   | `ruby jwt_decoder.rb <token>`        |
| PHP        | `firebase/php-jwt`          | `php jwt_decoder.php <token>`        |

> Для единообразия все скрипты принимают токен как первый аргумент командной строки.

## 📖 Пример использования

```bash
$ python jwt_decoder.py eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MTYyMzkwMjJ9.7XTNlQXVfFhBmTPv9_q-M5Fz2zqXgQjKjQz3X0Y8tHs
