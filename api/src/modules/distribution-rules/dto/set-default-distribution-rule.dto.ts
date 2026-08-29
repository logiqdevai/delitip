import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SetDefaultDistributionRuleDto {
    @ApiProperty({
        nullable: true,
        description: 'Distribution rule id to set as the store default, or null to clear it',
    })
    @IsOptional()
    @IsString()
    distribution_rule_id: string | null;
}
