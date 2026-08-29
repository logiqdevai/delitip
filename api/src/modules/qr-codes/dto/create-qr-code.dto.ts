import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { QrCodeSelectionMode } from 'generated/prisma';

export class CreateQrCodeDto {
    @ApiProperty({ example: 'Table 12' })
    @IsString()
    @MinLength(1)
    label: string;

    @ApiProperty({
        enum: QrCodeSelectionMode,
        default: QrCodeSelectionMode.CHOOSE_ONE,
        required: false,
        description: 'Only meaningful when 2+ employees are assigned; ignored for 0 or 1 (§3)',
    })
    @IsOptional()
    @IsEnum(QrCodeSelectionMode)
    selection_mode?: QrCodeSelectionMode;

    @ApiProperty({ required: false, description: 'Override for this QR code only; omit to fall back to the store default' })
    @IsOptional()
    @IsString()
    distribution_rule_id?: string;

    @ApiProperty({ required: false, type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    employee_ids?: string[];

    @ApiProperty({ required: false, type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    spot_ids?: string[];
}
