import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateRefundDto {
    @ApiProperty()
    @IsString()
    tip_id: string;

    @ApiProperty({ required: false, description: 'Defaults to the full tip amount if omitted' })
    @IsOptional()
    @IsInt()
    @IsPositive()
    amount?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    reason?: string;
}

export class CreatePublicRefundRequestDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @IsPositive()
    amount?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    reason?: string;

    @ApiProperty({ required: false, description: "The customer's email, to link the request back to their Account if one exists" })
    @IsOptional()
    @IsEmail()
    customer_email?: string;
}
