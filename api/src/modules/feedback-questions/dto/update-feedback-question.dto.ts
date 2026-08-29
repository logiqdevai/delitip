import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateFeedbackQuestionDto } from './create-feedback-question.dto';

export class UpdateFeedbackQuestionDto extends PartialType(CreateFeedbackQuestionDto) {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}
