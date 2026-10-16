import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ApprovePayoutRequestDto {
  @ApiProperty({ required: false, description: 'Optional note shown to the Store' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  admin_note?: string;
}

export class RejectPayoutRequestDto {
  @ApiProperty({ description: 'Why the request was rejected — shown to the Store so it can submit a corrected invoice' })
  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  admin_note: string;
}
