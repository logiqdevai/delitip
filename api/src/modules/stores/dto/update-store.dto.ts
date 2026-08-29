import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';
import { CreateStoreDto } from './create-store.dto';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @ApiProperty({ required: false, description: 'Document id of the uploaded logo' })
    @IsOptional()
    @IsString()
    logo_document_id?: string;

    @ApiProperty({ required: false, description: 'Document id of the uploaded cover image' })
    @IsOptional()
    @IsString()
    cover_document_id?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    primary_color?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    secondary_color?: string;

    @ApiProperty({ required: false, type: [Number], default: [2, 10, 20, 50] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    suggested_tip_amounts?: number[];

    @ApiProperty({ required: false, default: true })
    @IsOptional()
    @IsBoolean()
    allow_custom_tip_amount?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUrl()
    public_review_redirect_url?: string;

    @ApiProperty({ required: false, default: 4 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    public_review_rating_threshold?: number;

    @ApiProperty({ required: false, description: 'Must reference a DistributionRule belonging to this store' })
    @IsOptional()
    @IsString()
    default_distribution_rule_id?: string;

    @ApiProperty({ required: false, description: 'Primary-language text; auto-translated (stub) into every supported language' })
    @IsOptional()
    @IsString()
    welcome_message?: string;

    @ApiProperty({ required: false, description: 'Primary-language text; auto-translated (stub) into every supported language' })
    @IsOptional()
    @IsString()
    thank_you_message?: string;
}
