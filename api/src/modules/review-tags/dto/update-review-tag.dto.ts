import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateReviewTagDto } from './create-review-tag.dto';

export class UpdateReviewTagDto extends PartialType(CreateReviewTagDto) {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}
