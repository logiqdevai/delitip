import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { DocumentType } from 'generated/prisma';

export class UploadDocumentDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;

    @ApiProperty({ enum: DocumentType, required: false, default: DocumentType.OTHER })
    @IsOptional()
    @IsEnum(DocumentType)
    type?: DocumentType;
}
