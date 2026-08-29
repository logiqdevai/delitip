import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { OrganizationRole } from 'generated/prisma';

export class AddMemberDto {
    @ApiProperty({ example: 'manager@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ enum: OrganizationRole, example: OrganizationRole.STORE_MANAGER })
    @IsEnum(OrganizationRole)
    role: OrganizationRole;

    @ApiProperty({
        required: false,
        description: 'Scope the membership to a single Store; omit for an Organization-wide role (§26)',
    })
    @IsOptional()
    @IsString()
    store_id?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    first_name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    last_name?: string;
}
