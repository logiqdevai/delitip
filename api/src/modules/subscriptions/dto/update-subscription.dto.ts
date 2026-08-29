import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { SubscriptionPlan } from 'generated/prisma';

export class UpdateSubscriptionDto {
    @ApiProperty({ enum: SubscriptionPlan, example: SubscriptionPlan.PROFESSIONAL })
    @IsEnum(SubscriptionPlan)
    plan: SubscriptionPlan;
}
