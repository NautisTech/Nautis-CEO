import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
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
    .setTitle('CEO Management API')
    .setDescription('API Multi-Tenant para Gestão Empresarial')
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

  const port = process.env.PORT || 9832;
  await app.listen(port);

  console.log(`
  ========================================
  🚀 CEO Management API
  ========================================
  🌐 Server: http://localhost:${port}
  📚 Docs: http://localhost:${port}/api/docs
  🔒 Environment: ${process.env.NODE_ENV || 'development'}
  ========================================
  `);
}

bootstrap();