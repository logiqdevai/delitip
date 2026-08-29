import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { FeedbackQuestionType } from 'generated/prisma';

export class CreateFeedbackQuestionDto {
    @ApiProperty({ example: 'How was the food?', description: 'Primary-language text; translated into the store\'s supported languages' })
    @IsString()
    @MinLength(1)
    question: string;

    @ApiProperty({ required: false, enum: FeedbackQuestionType, default: FeedbackQuestionType.RATING })
    @IsOptional()
    @IsEnum(FeedbackQuestionType)
    type?: FeedbackQuestionType;

    @ApiProperty({ required: false, default: 0 })
    @IsOptional()
    @IsInt()
    sort_order?: number;
}
