import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { IsIban } from '@/shared/validators/is-iban.validator';

export class CreatePayoutAccountDto {
    @ApiProperty({ description: 'IBAN of the account tips will be paid out to' })
    @IsString()
    @MaxLength(34)
    @IsIban()
    iban: string;

    @ApiProperty({ description: 'Legal name on the bank account' })
    @IsString()
    @MinLength(2)
    @MaxLength(140)
    beneficiary_name: string;

    @ApiProperty({ required: false, description: 'Optional alias/description for this account' })
    @IsOptional()
    @IsString()
    @MaxLength(60)
    friendly_name?: string;
}
