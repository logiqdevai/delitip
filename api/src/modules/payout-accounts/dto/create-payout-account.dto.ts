import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaymentProvider } from 'generated/prisma';

export class CreatePayoutAccountDto {
    @ApiProperty({ enum: PaymentProvider, default: PaymentProvider.VIVA, required: false })
    @IsOptional()
    @IsEnum(PaymentProvider)
    provider?: PaymentProvider;
}
