import { IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssociarGruposDto {
    @ApiProperty({ type: [Number] })
    @IsArray()
    @IsInt({ each: true })
    gruposIds: number[];
}
