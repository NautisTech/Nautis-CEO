import { Module } from '@nestjs/common';
import { ConteudosPublicController } from './conteudos-public.controller';
import { ConteudosController } from './conteudos.controller';
import { ConteudosService } from './conteudos.service';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { ComentariosController } from './comentarios.controller';
import { ComentariosService } from './comentarios.service';
import { TiposConteudoController } from './tipos-conteudo.controller';
import { TiposConteudoService } from './tipos-conteudo.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [
        CategoriasController,
        TagsController,
        ComentariosController,
        TiposConteudoController,
        ConteudosController,
        ConteudosPublicController,
    ],
    providers: [
        CategoriasService,
        TagsService,
        ComentariosService,
        TiposConteudoService,
        ConteudosService,
    ],
    exports: [ConteudosService],
})
export class ConteudosModule { }