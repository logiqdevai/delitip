import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateReviewDto {
    @ApiProperty({ required: false, type: [String], description: 'Replaces all tag assignments on this review' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tag_ids?: string[];
}
