import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSettlementDto {
  @ApiProperty({ description: 'The employee being handed their share' })
  @IsString()
  employee_id: string;

  @ApiProperty({
    type: [String],
    description:
      "The owed shares this handover covers. The amount is derived from these rows on the server — a Store can't settle an arbitrary figure, because every cent has to trace back to a tip.",
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  distribution_ids: string[];

  @ApiPropertyOptional({
    type: [String],
    description:
      'Proposed deductions to apply to this handover, e.g. a tip refunded after its share was already handed over.',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  adjustment_ids?: string[];

  @ApiPropertyOptional({
    description:
      "When the handover actually happened. Defaults to now, and may predate the bank transfer reaching the Store — a Store can pay its staff the same night and be paid by us days later.",
  })
  @IsOptional()
  @IsDateString()
  settled_at?: string;

  @ApiPropertyOptional({ description: "The Store's own note, e.g. how it was handed over" })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;

  @ApiPropertyOptional({ description: "The Store's own reference, e.g. a payroll run or transfer id" })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  reference?: string;
}
