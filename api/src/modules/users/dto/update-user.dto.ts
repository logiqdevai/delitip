import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsPhoneNumber } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({ required: false, example: 'Maria' })
    @IsOptional()
    @IsString()
    first_name?: string;

    @ApiProperty({ required: false, example: 'Papadopoulou' })
    @IsOptional()
    @IsString()
    last_name?: string;

    @ApiProperty({ required: false, example: '+306912345678' })
    @IsOptional()
    @IsString()
    phone?: string;
}
