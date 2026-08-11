
### 1. `jwt_decoder.py` (Python)

```python
# jwt_decoder.py — Python версия

import sys
import jwt
from datetime import datetime, timezone
import json
from colorama import init, Fore, Style

init(autoreset=True)

def decode_token(token):
    try:
        # Декодируем без проверки подписи (чтобы посмотреть payload)
        header = jwt.get_unverified_header(token)
        payload = jwt.decode(token, options={"verify_signature": False})
        return header, payload, None
    except Exception as e:
        return None, None, str(e)

def check_expiration(payload):
    exp = payload.get('exp')
    if not exp:
        return None, "⏳ Поле 'exp' отсутствует, срок не установлен"
    now = datetime.now(timezone.utc)
    exp_time = datetime.fromtimestamp(exp, timezone.utc)
    if exp_time > now:
        delta = exp_time - now
        return True, f"✅ Действителен, осталось {delta.days} дн, {delta.seconds//3600} ч, {(delta.seconds%3600)//60} мин"
    else:
        delta = now - exp_time
        return False, f"❌ Просрочен на {delta.days} дн, {delta.seconds//3600} ч, {(delta.seconds%3600)//60} мин"

def main():
    if len(sys.argv) < 2:
        print(f"{Fore.RED}Usage: python jwt_decoder.py <token>")
        sys.exit(1)
    token = sys.argv[1]
    print(f"{Fore.CYAN}🔐 JWT Decoder (Python){Style.RESET_ALL}")
    print("-" * 40)
    header, payload, err = decode_token(token)
    if err:
        print(f"{Fore.RED}Ошибка декодирования: {err}")
        sys.exit(1)
    print(f"{Fore.YELLOW}Header:{Style.RESET_ALL} {json.dumps(header, indent=2)}")
    print(f"{Fore.GREEN}Payload:{Style.RESET_ALL} {json.dumps(payload, indent=2)}")
    
    if payload:
        valid, msg = check_expiration(payload)
        if valid is None:
            print(msg)
        else:
            print(msg)
    # Доп. фича: показываем алгоритм
    alg = header.get('alg', 'unknown')
    print(f"Алгоритм: {alg}")

if __name__ == "__main__":
    main()
