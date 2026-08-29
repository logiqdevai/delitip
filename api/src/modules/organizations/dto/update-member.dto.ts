import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrganizationRole } from 'generated/prisma';

export class UpdateMemberDto {
    @ApiProperty({ enum: OrganizationRole, required: false })
    @IsOptional()
    @IsEnum(OrganizationRole)
    role?: OrganizationRole;

    @ApiProperty({ required: false, description: 'Set to rescope to a Store, or omit/null for Organization-wide' })
    @IsOptional()
    @IsString()
    store_id?: string | null;
}
