import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) { }

    @Post()
    @ApiOperation({ summary: 'Send a message from the public contact form' })
    @ApiBody({ type: CreateContactDto })
    @ApiResponse({
        status: 201,
        description: 'Message sent successfully',
    })
    async submit(@Body() dto: CreateContactDto) {
        return this.contactService.submit(dto);
    }
}
