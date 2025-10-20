import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import 'dotenv/config';
import { join } from 'path/win32';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/api/uploads/',
  });


  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('API Nautis CEO')
    .setDescription(`Documentação da API do NAUTIS CEO \\
      1. SEM GUARDS → Totalmente aberto (não recomendado) \\
      2. @Public() → Sem autenticação (qualquer um acessa) \\
      3. @UseGuards(JwtAuthGuard) → Precisa estar autenticado \\
      4. @UseGuards(JwtAuthGuard, TenantGuard) → Autenticado + Tenant válido \\
      5. @RequirePermissions('...') → Autenticado + Tenant + Permissão específica`)
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Autenticação e autorização')
    .addTag('Tenants', 'Gestão de tenants')
    .addTag('Funcionários', 'Gestão de funcionários')
    .addTag('Empresas', 'Gestão de empresas')
    .addTag('Conteúdos', 'Gestão de conteúdos')
    .addTag('Suporte', 'Tickets e equipamentos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Definir prefixo global para rotas (todas as rotas serão acessíveis via /api/*)
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 9832;
  await app.listen(port);

  console.log(`
  ========================================
  🚀 API Nautis CEO
  ========================================
  🌐 Server: http://localhost:${port}
  📚 Docs: http://localhost:${port}/api/docs
  📁 Uploads: http://localhost:${port}/api/uploads
  🔒 Environment: ${process.env.NODE_ENV || 'development'}
  ========================================
  `);
}

bootstrap();