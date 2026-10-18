import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsObject, IsOptional } from 'class-validator';
import { CreateReviewCategoryDto } from './create-review-category.dto';

export class UpdateReviewCategoryDto extends PartialType(CreateReviewCategoryDto) {
    @ApiProperty({
        required: false,
        example: { en: 'Friendliness', el: 'Φιλικότητα' },
        description:
            "Map of lowercase language code -> name text. Merged into the existing translations; must include the store's primary language. Takes precedence over name.",
    })
    @IsOptional()
    @IsObject()
    name_translations?: Record<string, string>;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}
