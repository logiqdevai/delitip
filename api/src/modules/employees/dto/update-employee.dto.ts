import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsObject, IsOptional } from 'class-validator';
import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto extends PartialType(OmitType(CreateEmployeeDto, ['full_name'] as const)) {
    @ApiProperty({
        required: false,
        example: { en: 'Maria Papadopoulou', el: 'Μαρία Παπαδοπούλου' },
        description:
            "Map of lowercase language code -> full name text. Merged into the existing translations; must include the store's primary language.",
    })
    @IsOptional()
    @IsObject()
    full_name_translations?: Record<string, string>;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}
