import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ReviewSentiment } from 'generated/prisma';

export class CreateReviewTagDto {
    @ApiProperty({ example: 'Friendly service' })
    @IsString()
    @MinLength(1)
    name: string;

    @ApiProperty({ required: false, enum: ReviewSentiment })
    @IsOptional()
    @IsEnum(ReviewSentiment)
    sentiment?: ReviewSentiment;
}
