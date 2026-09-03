import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { IsIban } from '@/shared/validators/is-iban.validator';
import { PayoutMethod } from 'generated/prisma';

export class CreatePayoutAccountDto {
    @ApiProperty({
        required: false,
        enum: PayoutMethod,
        default: PayoutMethod.IBAN,
        description:
            'How this payout account receives funds. CONNECTED_ACCOUNT (Store-only, gated behind a rollout flag) hands off to the provider\'s hosted onboarding instead of collecting an IBAN here.',
    })
    @IsOptional()
    @IsEnum(PayoutMethod)
    payout_method?: PayoutMethod;

    @ApiProperty({ required: false, description: 'IBAN of the account tips will be paid out to — required unless payout_method is CONNECTED_ACCOUNT' })
    @ValidateIf((dto) => dto.payout_method !== PayoutMethod.CONNECTED_ACCOUNT)
    @IsString()
    @MaxLength(34)
    @IsIban()
    iban?: string;

    @ApiProperty({ required: false, description: 'Legal name on the bank account — required unless payout_method is CONNECTED_ACCOUNT' })
    @ValidateIf((dto) => dto.payout_method !== PayoutMethod.CONNECTED_ACCOUNT)
    @IsString()
    @MinLength(2)
    @MaxLength(140)
    beneficiary_name?: string;

    @ApiProperty({ required: false, description: 'Optional alias/description for this account' })
    @IsOptional()
    @IsString()
    @MaxLength(60)
    friendly_name?: string;
}
