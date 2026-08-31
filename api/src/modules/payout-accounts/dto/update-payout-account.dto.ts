import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// status/provider are no longer client-settable — connecting an account now
// makes a real Viva call, so its lifecycle is driven by that response and
// by webhooks, not by a free-form PATCH (payment plan §16).
export class UpdatePayoutAccountDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(140)
    beneficiary_name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MaxLength(60)
    friendly_name?: string;
}
