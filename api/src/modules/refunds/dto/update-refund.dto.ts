import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RefundStatus } from 'generated/prisma';

export class UpdateRefundDto {
    @ApiProperty({ enum: RefundStatus })
    @IsEnum(RefundStatus)
    status: RefundStatus;
}
