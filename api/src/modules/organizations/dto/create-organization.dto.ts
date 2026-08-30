import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { StoreIndustry } from 'generated/prisma';

export class CreateInitialStoreDto {
    @ApiProperty({ example: 'Bella Restaurant' })
    @IsString()
    @MinLength(1)
    name: string;

    @ApiProperty({ enum: StoreIndustry })
    @IsEnum(StoreIndustry)
    industry: StoreIndustry;
}

export class CreateOrganizationDto {
    @ApiProperty({ example: 'Bella Restaurant' })
    @IsString()
    @MinLength(1)
    name: string;

    @ApiProperty({
        required: false,
        type: CreateInitialStoreDto,
        description: "Optionally create the Organization's first Store in the same step (§31) — for a single-Store business this keeps the Organization invisible as its own step.",
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateInitialStoreDto)
    store?: CreateInitialStoreDto;
}
