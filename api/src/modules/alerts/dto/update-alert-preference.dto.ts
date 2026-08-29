import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateAlertPreferenceDto {
    @ApiProperty({ example: true })
    @IsBoolean()
    is_enabled: boolean;
}
