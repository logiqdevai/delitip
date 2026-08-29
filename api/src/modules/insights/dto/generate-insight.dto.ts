import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class GenerateInsightDto {
    @ApiProperty({
        required: false,
        description: 'ISO date string; defaults to 7 days before period_end (or now) when omitted',
        example: '2026-08-01T00:00:00.000Z',
    })
    @IsOptional()
    @IsDateString()
    period_start?: string;

    @ApiProperty({
        required: false,
        description: 'ISO date string; defaults to now when omitted',
        example: '2026-08-29T00:00:00.000Z',
    })
    @IsOptional()
    @IsDateString()
    period_end?: string;
}
