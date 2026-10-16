import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreatePayoutRequestDto {
  @ApiProperty({ description: 'Document id of the uploaded invoice (POST /documents first). PDF, JPEG or PNG, max 10 MB.' })
  @IsUUID()
  invoice_document_id: string;

  @ApiProperty({ required: false, description: 'Invoice number as printed on the invoice, used to cross-check the automatic read' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  invoice_number?: string;

  @ApiProperty({ required: false, description: 'Optional note for the reviewing admin' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  store_note?: string;
}
