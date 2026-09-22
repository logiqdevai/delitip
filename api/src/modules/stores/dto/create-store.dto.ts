import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsEnum, IsIn, IsNumber, IsOptional, IsString, IsUUID, MinLength, ValidateNested } from 'class-validator';
import { Currency, Language, StoreIndustry } from 'generated/prisma';
import { StoreCopyOption, StoreCopyOptions } from '../constants/store-copy-options.constant';

export class StoreFullAddressDto {
    @ApiProperty({ description: 'Google Places place ID' })
    @IsString()
    placeId: string;

    @ApiProperty()
    @IsString()
    formattedAddress: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    streetAddress?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    subpremise?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    state?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    stateCode?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    postalCode?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    country?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    countryCode?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    lat?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    lng?: number;
}

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

    @ApiProperty({
        required: false,
        type: StoreFullAddressDto,
        description: 'Full parsed address from Google Places autocomplete',
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => StoreFullAddressDto)
    full_address?: StoreFullAddressDto;

    @ApiProperty({
        required: false,
        description: 'Existing store in the same Organization to copy the selected copy_options from',
    })
    @IsOptional()
    @IsUUID()
    copy_from_store_id?: string;

    @ApiProperty({
        required: false,
        enum: Object.values(StoreCopyOptions),
        isArray: true,
        description: 'Which groups of settings to copy from copy_from_store_id. Copied values override the fields above.',
    })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsIn(Object.values(StoreCopyOptions), { each: true })
    copy_options?: StoreCopyOption[];
}
