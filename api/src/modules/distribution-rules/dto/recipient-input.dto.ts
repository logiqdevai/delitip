import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { DistributionRecipientType } from 'generated/prisma';

export class RecipientInputDto {
    @ApiProperty({ enum: DistributionRecipientType, example: DistributionRecipientType.EMPLOYEE })
    @IsEnum(DistributionRecipientType)
    recipient_type: DistributionRecipientType;

    @ApiProperty({
        required: false,
        description: 'Required when recipient_type is EMPLOYEE; must be omitted for STORE',
    })
    @IsOptional()
    @IsString()
    employee_id?: string;

    @ApiProperty({ example: 50, minimum: 0, maximum: 100 })
    @IsNumber()
    @Min(0)
    @Max(100)
    percentage: number;

    @ApiProperty({ required: false, default: 0, description: 'Display order; index in the array if omitted' })
    @IsOptional()
    @IsInt()
    sort_order?: number;
}
