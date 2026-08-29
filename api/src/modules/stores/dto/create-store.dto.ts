import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Currency, Language, StoreIndustry } from 'generated/prisma';

export class CreateStoreDto {
    @ApiProperty({ example: 'Bella Restaurant' })
    @IsString()
    @MinLength(1)
    name: string;

    @ApiProperty({ enum: StoreIndustry })
    @IsEnum(StoreIndustry)
    industry: StoreIndustry;

    @ApiProperty({ enum: Language, required: false, default: Language.EN })
    @IsOptional()
    @IsEnum(Language)
    primary_language?: Language;

    @ApiProperty({ enum: Language, isArray: true, required: false, default: [Language.EN] })
    @IsOptional()
    @IsArray()
    @IsEnum(Language, { each: true })
    supported_languages?: Language[];

    @ApiProperty({ enum: Currency, required: false, default: Currency.EUR })
    @IsOptional()
    @IsEnum(Currency)
    currency?: Currency;

    @ApiProperty({ required: false, default: 'UTC' })
    @IsOptional()
    @IsString()
    timezone?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    address_line?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    country?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    postal_code?: string;
}
