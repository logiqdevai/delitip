import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { DistributionPayoutMode } from 'generated/prisma';
import { RecipientInputDto } from './recipient-input.dto';

export class CreateDistributionRuleDto {
    @ApiProperty({ example: 'Standard split' })
    @IsString()
    @MinLength(1)
    name: string;

    @ApiProperty({
        type: [RecipientInputDto],
        description: "The rule's recipients; their percentages must sum to exactly 100",
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RecipientInputDto)
    recipients: RecipientInputDto[];

    @ApiPropertyOptional({
        enum: DistributionPayoutMode,
        default: DistributionPayoutMode.DIRECT,
        description:
            'DIRECT pays every recipient their own share to their own payout account. VIA_STORE sends the whole tip to the Store, which then hands each employee their share itself — the percentages still decide what each employee earned, which becomes what the Store owes them.',
    })
    @IsOptional()
    @IsEnum(DistributionPayoutMode)
    payout_mode?: DistributionPayoutMode;
}
