import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RunPayoutDto {
  @ApiProperty({
    required: false,
    description: 'Scope this run to a single employee instead of the whole store',
  })
  @IsOptional()
  @IsString()
  employee_id?: string;
}
