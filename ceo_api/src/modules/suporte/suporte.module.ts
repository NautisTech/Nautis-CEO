import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { IntervencoesController } from './intervencoes.controller';
import { TicketsService } from './tickets.service';
import { IntervencoesService } from './intervencoes.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [TicketsController, IntervencoesController],
    providers: [TicketsService, IntervencoesService],
    exports: [TicketsService, IntervencoesService]
})
export class SuporteModule { }
