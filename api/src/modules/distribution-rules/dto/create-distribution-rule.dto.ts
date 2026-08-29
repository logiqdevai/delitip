import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, MinLength, ValidateNested } from 'class-validator';
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
}
