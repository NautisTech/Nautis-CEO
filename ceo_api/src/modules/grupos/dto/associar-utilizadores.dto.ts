import { IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssociarUtilizadoresDto {
    @ApiProperty({ type: [Number] })
    @IsArray()
    @IsInt({ each: true })
    utilizadoresIds: number[];
}