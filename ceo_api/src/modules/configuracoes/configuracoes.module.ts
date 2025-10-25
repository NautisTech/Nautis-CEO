import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';
import { ConfiguracoesService } from './configuracoes.service';
import { ConfiguracoesController } from './configuracoes.controller';


@Module({
    imports: [DatabaseModule],
    controllers: [
        ConfiguracoesController,
    ],
    providers: [
        ConfiguracoesService,
    ],
    exports: [
        ConfiguracoesService,
    ],
})
export class ConfiguracoesModule { }