import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateSpotDto {
    @ApiProperty({ example: 'Table 12' })
    @IsString()
    @MinLength(1)
    name: string;
}
