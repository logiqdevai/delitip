import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsEnum, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { Currency } from 'generated/prisma';

export class CreatePublicTipDto {
    @ApiProperty({ description: 'The QR code that was scanned' })
    @IsString()
    qr_code_id: string;

    @ApiProperty({ required: false, description: 'The single employee picked (Choose-one mode, or confirming a 1-employee QR)' })
    @IsOptional()
    @IsString()
    employee_id?: string;

    @ApiProperty({ required: false, type: [String], description: 'The employees picked (Choose-many mode)' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    employee_ids?: string[];

    @ApiProperty({ description: 'Amount in the smallest currency unit (e.g. cents)', example: 1000 })
    @IsInt()
    @IsPositive()
    amount: number;

    @ApiProperty({ enum: Currency, required: false })
    @IsOptional()
    @IsEnum(Currency)
    currency?: Currency;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEmail()
    customer_email?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    customer_name?: string;
}
