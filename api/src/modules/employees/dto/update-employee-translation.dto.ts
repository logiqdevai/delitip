import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MinLength } from 'class-validator';
import { Language } from 'generated/prisma';

export class UpdateEmployeeTranslationDto {
    @ApiProperty({ enum: Language })
    @IsEnum(Language)
    language: Language;

    @ApiProperty({ example: 'Maria Papadopoulou' })
    @IsString()
    @MinLength(1)
    text: string;
}
