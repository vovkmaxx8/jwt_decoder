# jwt_decoder.rb — Ruby версия

require 'jwt'
require 'json'
require 'colorize'

def decode_token(token)
  begin
    # Декодируем без проверки подписи
    decoded = JWT.decode(token, nil, false)
    header = decoded[1]
    payload = decoded[0]
    return header, payload, nil
  rescue => e
    return nil, nil, e.message
  end
end

def check_expiration(payload)
  exp = payload['exp']
  return nil, "⏳ Поле 'exp' отсутствует" unless exp

  exp_time = Time.at(exp).utc
  now = Time.now.utc
  if exp_time > now
    diff = exp_time - now
    days = (diff / 86400).to_i
    hours = ((diff % 86400) / 3600).to_i
    mins = ((diff % 3600) / 60).to_i
    return true, "✅ Действителен, осталось: #{days} дн, #{hours} ч, #{mins} мин"
  else
    diff = now - exp_time
    days = (diff / 86400).to_i
    hours = ((diff % 86400) / 3600).to_i
    mins = ((diff % 3600) / 60).to_i
    return false, "❌ Просрочен на: #{days} дн, #{hours} ч, #{mins} мин"
  end
end

if ARGV.length < 1
  puts "Usage: ruby jwt_decoder.rb <token>"
  exit 1
end

token = ARGV[0]
header, payload, error = decode_token(token)
if error
  puts "Ошибка: #{error}".red
  exit 1
end

puts "🔐 JWT Decoder (Ruby)".cyan
puts "---------------------".cyan
puts "Header: #{header.to_json}".yellow
puts "Payload: #{payload.to_json}".green

if payload
  valid, msg = check_expiration(payload)
  puts msg
end
puts "Алгоритм: #{header['alg']}"
