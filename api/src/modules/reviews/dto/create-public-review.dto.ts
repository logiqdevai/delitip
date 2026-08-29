import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsInt, IsOptional, IsString, Max, Min, MinLength, ValidateNested } from 'class-validator';

export class CategoryRatingInputDto {
    @ApiProperty()
    @IsString()
    review_category_id: string;

    @ApiProperty({ minimum: 1, maximum: 5 })
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;
}

export class FeedbackResponseInputDto {
    @ApiProperty()
    @IsString()
    feedback_question_id: string;

    @ApiProperty({ required: false, minimum: 1, maximum: 5 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    rating_value?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    text_value?: string;
}

export class CreatePublicReviewDto {
    @ApiProperty()
    @IsString()
    store_id: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    tip_id?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    employee_id?: string;

    @ApiProperty({ minimum: 1, maximum: 5 })
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    comment?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEmail()
    customer_email?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MinLength(1)
    customer_name?: string;

    @ApiProperty({ required: false, type: [CategoryRatingInputDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CategoryRatingInputDto)
    category_ratings?: CategoryRatingInputDto[];

    @ApiProperty({ required: false, type: [FeedbackResponseInputDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FeedbackResponseInputDto)
    feedback_responses?: FeedbackResponseInputDto[];
}
