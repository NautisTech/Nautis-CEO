import { IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssociarPermissoesDto {
    @ApiProperty({ type: [Number] })
    @IsArray()
    @IsInt({ each: true })
    permissoesIds: number[];
}
