import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { StoreFullAddressDto } from '@/modules/stores/dto/create-store.dto';

export class UpdateOrganizationDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MinLength(1)
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @ApiProperty({ required: false, description: 'Document id of the uploaded logo' })
    @IsOptional()
    @IsString()
    logo_document_id?: string;

    @ApiProperty({ required: false, description: 'VAT registration number, for invoicing' })
    @IsOptional()
    @IsString()
    vat_number?: string;

    @ApiProperty({ required: false, description: 'Registered legal entity name, may differ from the customer-facing name' })
    @IsOptional()
    @IsString()
    legal_name?: string;

    @ApiProperty({ required: false, description: 'Declared business activity, shown on invoices' })
    @IsOptional()
    @IsString()
    profession?: string;

    @ApiProperty({ required: false, description: 'Greek tax office (Δ.Ο.Υ.) — only relevant for Greek-registered organizations' })
    @IsOptional()
    @IsString()
    doy?: string;

    @ApiProperty({ required: false, description: 'Registered billing address used on invoices' })
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
}
