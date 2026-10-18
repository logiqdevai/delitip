import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsObject, IsOptional } from 'class-validator';
import { CreateFeedbackQuestionDto } from './create-feedback-question.dto';

export class UpdateFeedbackQuestionDto extends PartialType(CreateFeedbackQuestionDto) {
    @ApiProperty({
        required: false,
        example: { en: 'How was the food?', el: 'Πώς ήταν το φαγητό;' },
        description:
            "Map of lowercase language code -> question text. Merged into the existing translations; must include the store's primary language. Takes precedence over question.",
    })
    @IsOptional()
    @IsObject()
    question_translations?: Record<string, string>;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}
