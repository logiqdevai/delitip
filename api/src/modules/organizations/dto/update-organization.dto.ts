import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

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
}
