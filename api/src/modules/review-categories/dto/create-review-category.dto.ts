import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateReviewCategoryDto {
    @ApiProperty({ example: 'Friendliness', description: 'Primary-language text; translated into the store\'s supported languages' })
    @IsString()
    @MinLength(1)
    name: string;

    @ApiProperty({ required: false, default: 0 })
    @IsOptional()
    @IsInt()
    sort_order?: number;
}
