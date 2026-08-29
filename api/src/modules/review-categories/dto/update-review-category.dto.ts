import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateReviewCategoryDto } from './create-review-category.dto';

export class UpdateReviewCategoryDto extends PartialType(CreateReviewCategoryDto) {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}
