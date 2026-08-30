import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsObject, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';
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

    @ApiProperty({ required: false, type: [Number], default: [200, 1000, 2000, 5000], description: 'Suggested tip amounts in minor currency units (e.g. cents)' })
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

    @ApiProperty({
        required: false,
        example: { en: 'Welcome to our restaurant!', el: 'Καλώς ήρθατε στο εστιατόριό μας!' },
        description: 'Map of lowercase language code -> welcome message text. Merged into the existing translations.',
    })
    @IsOptional()
    @IsObject()
    welcome_message_translations?: Record<string, string>;

    @ApiProperty({
        required: false,
        example: { en: 'Thank you!', el: 'Ευχαριστούμε!' },
        description: 'Map of lowercase language code -> thank-you message text. Merged into the existing translations.',
    })
    @IsOptional()
    @IsObject()
    thank_you_message_translations?: Record<string, string>;
}
