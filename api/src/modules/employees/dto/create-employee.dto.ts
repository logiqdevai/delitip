import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateEmployeeDto {
    @ApiProperty({ example: 'Maria Papadopoulou' })
    @IsString()
    @MinLength(1)
    full_name: string;

    @ApiProperty({ example: 'maria@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ required: false, example: 'Waiter' })
    @IsOptional()
    @IsString()
    position?: string;

    @ApiProperty({ required: false, description: 'Document id of the uploaded photo' })
    @IsOptional()
    @IsString()
    photo_document_id?: string;
}
