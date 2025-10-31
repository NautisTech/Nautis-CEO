import crypto from 'crypto';

const key = Buffer.from(process.argv[2], 'hex'); // chave passada como argumento
const iv = Buffer.alloc(16, 0);

function encrypt(value) {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
    return encrypted.toString('base64');
}

// exemplo:
console.log('DB_HOST:', encrypt('62.28.239.206'));
console.log('DB_PORT:', encrypt('4002'));
console.log('DB_USER:', encrypt('sa'));
console.log('DB_PASSWORD:', encrypt('MicroLop3s@2025!'));