import { PartialType } from '@nestjs/swagger';
import { CriarPermissaoDto } from './criar-permissao.dto';

export class AtualizarPermissaoDto extends PartialType(CriarPermissaoDto) { }