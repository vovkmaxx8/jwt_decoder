// jwt_decoder.cs — C# версия

using System;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Text.Json;

class Program
{
    static void Main(string[] args)
    {
        if (args.Length == 0)
        {
            Console.WriteLine("Usage: dotnet run <token>");
            return;
        }
        string token = args[0];

        try
        {
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadJwtToken(token);

            Console.WriteLine("\U0001F510 JWT Decoder (C#)");
            Console.WriteLine("------------------------");
            Console.WriteLine($"Header: {JsonSerializer.Serialize(jsonToken.Header, new JsonSerializerOptions { WriteIndented = true })}");
            Console.WriteLine($"Payload: {JsonSerializer.Serialize(jsonToken.Payload, new JsonSerializerOptions { WriteIndented = true })}");

            var expClaim = jsonToken.Payload.FirstOrDefault(c => c.Key == "exp");
            if (expClaim.Key != null && long.TryParse(expClaim.Value.ToString(), out long expUnix))
            {
                var expTime = DateTimeOffset.FromUnixTimeSeconds(expUnix).UtcDateTime;
                var now = DateTime.UtcNow;
                if (expTime > now)
                {
                    var diff = expTime - now;
                    Console.WriteLine($"✅ Действителен, осталось: {diff.Days} дн, {diff.Hours} ч, {diff.Minutes} мин");
                }
                else
                {
                    var diff = now - expTime;
                    Console.WriteLine($"❌ Просрочен на: {diff.Days} дн, {diff.Hours} ч, {diff.Minutes} мин");
                }
            }
            else
            {
                Console.WriteLine("⏳ Поле exp отсутствует");
            }
            Console.WriteLine($"Алгоритм: {jsonToken.Header.Alg}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ошибка: {ex.Message}");
        }
    }
}
