import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class UpdateAppConfigDto {
    @ApiProperty({ required: false, example: 5, description: 'Platform commission taken from each tip, in percent' })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Max(100)
    tip_platform_commission_percentage?: number;

    @ApiProperty({ required: false, example: 2.4, description: 'Estimated processor fee percentage (display only until settlement)' })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Max(100)
    tip_processor_fee_estimate_percentage?: number;

    @ApiProperty({ required: false, example: 24, description: 'Estimated fixed processor fee in minor units (24 = €0.24)' })
    @IsOptional()
    @IsInt()
    @Min(0)
    tip_processor_fee_estimate_fixed_amount?: number;

    @ApiProperty({ required: false, example: 48, description: 'Hours a tip is held before it becomes payable' })
    @IsOptional()
    @IsInt()
    @Min(0)
    payout_hold_window_hours?: number;

    @ApiProperty({ required: false, example: 24, description: 'VAT % added on top of the tip amount at checkout. 0 = no VAT.' })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Max(100)
    vat_rate_percentage?: number;
    @ApiProperty({ required: false, example: false, description: "When true, a Store's own money is only paid through an admin-reviewed payout request backed by an invoice" })
    @IsOptional()
    @IsBoolean()
    payout_invoice_required?: boolean;

    @ApiProperty({ required: false, example: true, description: "Read uploaded invoices with OpenAI and flag mismatches for the admin" })
    @IsOptional()
    @IsBoolean()
    payout_invoice_ai_check_enabled?: boolean;

    @ApiProperty({ required: false, example: false, description: 'Let Stores onboard via Viva Marketplace (connected accounts). Needs real Viva platform credentials.' })
    @IsOptional()
    @IsBoolean()
    connected_account_payouts_enabled?: boolean;

    @ApiProperty({ required: false, example: true, description: "Tips are only transferred to stores (no direct staff payouts). Hides staff payout actions." })
    @IsOptional()
    @IsBoolean()
    tip_payouts_store_only?: boolean;

    @ApiProperty({ required: false, example: "Delitip P.C.", description: "Legal name Stores must put on invoices to the platform" })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    platform_legal_name?: string;

    @ApiProperty({ required: false, example: "EL123456789", description: "Platform VAT number for invoices" })
    @IsOptional()
    @IsString()
    @MaxLength(40)
    platform_vat_number?: string;

    @ApiProperty({ required: false, example: "Δ.Ο.Υ. Ηρακλείου", description: "Platform tax office for invoices" })
    @IsOptional()
    @IsString()
    @MaxLength(120)
    platform_tax_office?: string;

    @ApiProperty({ required: false, example: "Pelasgon 32, Heraklion 71202, Greece", description: "Platform billing address for invoices" })
    @IsOptional()
    @IsString()
    @MaxLength(300)
    platform_address?: string;

    @ApiProperty({ required: false, example: "Also email the PDF to invoices@logiqdev.com", description: "Free-text instructions shown to Stores when they request a payout" })
    @IsOptional()
    @IsString()
    @MaxLength(2000)
    payout_invoice_instructions?: string;
}
