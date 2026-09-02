import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export const ContactTopics = ['sales', 'support', 'billing', 'partnerships'] as const;
export type ContactTopic = (typeof ContactTopics)[number];

export class CreateContactDto {
    @ApiProperty({
        description: 'What the message is about',
        enum: ContactTopics,
        example: 'sales',
    })
    @IsIn(ContactTopics)
    topic: ContactTopic;

    @ApiProperty({
        description: 'Full name of the sender',
        example: 'Alex Rivera',
    })
    @IsString()
    @MinLength(1)
    name: string;

    @ApiProperty({
        description: 'Email address of the sender',
        example: 'alex@northline.com',
        format: 'email',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Business name',
        example: 'Northline Support',
        required: false,
    })
    @IsOptional()
    @IsString()
    company?: string;

    @ApiProperty({
        description: 'Message content',
        example: 'Tell us about your team or what you need help with.',
    })
    @IsString()
    @MinLength(1)
    message: string;
}
