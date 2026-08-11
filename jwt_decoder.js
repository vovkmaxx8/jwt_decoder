// jwt_decoder.js — JavaScript версия

const jwt = require('jsonwebtoken');
const { program } = require('commander'); // для продвинутого CLI

program
  .argument('<token>', 'JWT токен')
  .option('-c, --color', 'Цветной вывод (по умолчанию включён)')
  .parse(process.argv);

const opts = program.opts();
const token = program.args[0];

if (!token) {
  console.error('Usage: node jwt_decoder.js <token>');
  process.exit(1);
}

// Цвета для консоли (простые)
const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  red: '\x1b[31m',
};

function decodeToken(tok) {
  try {
    // декодируем без проверки
    const decoded = jwt.decode(tok, { complete: true });
    if (!decoded) throw new Error('Невалидный JWT');
    return decoded;
  } catch (e) {
    console.error(`${colors.red}Ошибка декодирования: ${e.message}${colors.reset}`);
    process.exit(1);
  }
}

function checkExp(payload) {
  if (!payload.exp) {
    console.log(`${colors.yellow}⏳ Поле 'exp' отсутствует${colors.reset}`);
    return;
  }
  const expTime = new Date(payload.exp * 1000);
  const now = new Date();
  const diff = expTime - now;
  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    console.log(`${colors.green}✅ Действителен, осталось: ${days} дн, ${hours} ч, ${mins} мин${colors.reset}`);
  } else {
    const expired = Math.abs(diff);
    const days = Math.floor(expired / (1000 * 60 * 60 * 24));
    const hours = Math.floor((expired % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((expired % (1000 * 60 * 60)) / (1000 * 60));
    console.log(`${colors.red}❌ Просрочен на: ${days} дн, ${hours} ч, ${mins} мин${colors.reset}`);
  }
}

const decoded = decodeToken(token);
console.log(`${colors.cyan}🔐 JWT Decoder (Node.js)${colors.reset}`);
console.log('-----------------------------------');
console.log(`${colors.yellow}Header:${colors.reset}`, JSON.stringify(decoded.header, null, 2));
console.log(`${colors.green}Payload:${colors.reset}`, JSON.stringify(decoded.payload, null, 2));
checkExp(decoded.payload);
console.log(`Алгоритм: ${decoded.header.alg}`);
