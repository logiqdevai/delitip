import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { ReviewVisibility } from 'generated/prisma';

export class UpdateReviewDto {
    @ApiProperty({ required: false, enum: ReviewVisibility })
    @IsOptional()
    @IsEnum(ReviewVisibility)
    visibility?: ReviewVisibility;

    @ApiProperty({ required: false, type: [String], description: 'Replaces all tag assignments on this review' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tag_ids?: string[];
}
