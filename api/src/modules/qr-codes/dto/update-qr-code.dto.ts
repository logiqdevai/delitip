import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { QrCodeSelectionMode } from 'generated/prisma';

export class UpdateQrCodeDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MinLength(1)
    label?: string;

    @ApiProperty({ enum: QrCodeSelectionMode, required: false })
    @IsOptional()
    @IsEnum(QrCodeSelectionMode)
    selection_mode?: QrCodeSelectionMode;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @ApiProperty({
        required: false,
        nullable: true,
        description: 'Set to override the distribution rule for this QR code only, or null to clear the override',
    })
    @IsOptional()
    @IsString()
    distribution_rule_id?: string | null;

    @ApiProperty({ required: false, type: [String], description: 'Replaces the full set of assigned employees' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    employee_ids?: string[];

    @ApiProperty({ required: false, type: [String], description: 'Replaces the full set of assigned spots' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    spot_ids?: string[];
}
