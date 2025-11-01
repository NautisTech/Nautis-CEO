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
import { SocialController } from './social.controller';
import { SocialService, InstagramService, FacebookService, LinkedInService } from './social.service';
import { DatabaseModule } from '../../database/database.module';
import { ConfiguracoesModule } from '../configuracoes/configuracoes.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
    imports: [DatabaseModule, ConfiguracoesModule, MailerModule],
    controllers: [
        CategoriasController,
        TagsController,
        ComentariosController,
        TiposConteudoController,
        ConteudosController,
        ConteudosPublicController,
        SocialController,
    ],
    providers: [
        CategoriasService,
        TagsService,
        ComentariosService,
        TiposConteudoService,
        ConteudosService,
        SocialService,
        InstagramService,
        FacebookService,
        LinkedInService,
    ],
    exports: [ConteudosService],
})
export class ConteudosModule { }