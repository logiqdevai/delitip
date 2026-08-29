import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaymentProvider, PayoutAccountStatus } from 'generated/prisma';

export class UpdatePayoutAccountDto {
    @ApiProperty({
        enum: PayoutAccountStatus,
        required: false,
        description: 'Mock the connected-account lifecycle, e.g. simulate RESTRICTED/DISABLED for testing',
    })
    @IsOptional()
    @IsEnum(PayoutAccountStatus)
    status?: PayoutAccountStatus;

    @ApiProperty({ enum: PaymentProvider, required: false })
    @IsOptional()
    @IsEnum(PaymentProvider)
    provider?: PaymentProvider;
}
