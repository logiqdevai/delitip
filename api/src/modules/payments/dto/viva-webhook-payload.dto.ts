import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsObject, IsOptional, IsString } from 'class-validator';

// Viva's webhook payload isn't exhaustively documented — validate only
// what's structurally required to dedupe and dispatch; EventData's shape
// varies per EventTypeId and is read defensively inside the handler.
export class VivaWebhookPayloadDto {
  @ApiProperty()
  @IsInt()
  EventTypeId: number;

  @ApiProperty()
  @IsString()
  MessageId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  EventData?: Record<string, unknown>;
}
