import { registerAs } from '@nestjs/config';
import 'dotenv/config';

export default registerAs('app', () => ({
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT ? process.env.PORT : '3001', 10) || 3001,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    apiPrefix: process.env.API_PREFIX || 'api',
    uploadMaxSize: parseInt(process.env.UPLOAD_MAX_SIZE ? process.env.UPLOAD_MAX_SIZE : '10485760', 10) || 10485760, // 10MB
    uploadPath: process.env.UPLOAD_PATH || './uploads',
}));