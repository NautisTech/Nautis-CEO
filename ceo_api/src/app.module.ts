import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import appConfig from './config/app.config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { FuncionariosModule } from './modules/funcionarios/funcionarios.module';
import { GruposModule } from './modules/grupos/grupos.module';
import { PermissoesModule } from './modules/permissoes/permissoes.module';
import { UtilizadoresModule } from './modules/utilizadores/utilizadores.module';
import { EmpresasModule } from './modules/empresas/empresas.module';
import { ConteudosModule } from './modules/conteudos/conteudos.module';
import { UploadsModule } from './modules/upload/upload.module';
// import { SuporteModule } from './modules/suporte/suporte.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { MailerModule } from './modules/mailer/mailer.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, appConfig],
    }),

    // Core
    DatabaseModule,
    AuthModule,

    // Modules
    TenantsModule,
    FuncionariosModule,
    EmpresasModule,
    ConteudosModule,
    UploadsModule,
    MailerModule,
    // SuporteModule,
    GruposModule,
    PermissoesModule,
    UtilizadoresModule,
  ],
  providers: [
    // Global guard (JWT em todas as rotas exceto Auth)
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }