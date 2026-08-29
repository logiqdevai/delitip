import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MinLength } from 'class-validator';
import { Language } from 'generated/prisma';

export class UpdateStoreTranslationDto {
    @ApiProperty({ enum: Language })
    @IsEnum(Language)
    language: Language;

    @ApiProperty({ example: 'Welcome to our restaurant!' })
    @IsString()
    @MinLength(1)
    text: string;
}
