import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';

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
}
