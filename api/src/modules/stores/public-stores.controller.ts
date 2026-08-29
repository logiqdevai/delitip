import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StoresService } from './services/stores.service';

@ApiTags('Public Stores')
@Controller('public/stores')
export class PublicStoresController {
    constructor(private readonly storesService: StoresService) { }

    @Get(':slug')
    @ApiOperation({ summary: "Public Store branding/config by slug — no auth required" })
    findBySlug(@Param('slug') slug: string, @Query('lang') lang?: string) {
        return this.storesService.findPublicBySlug(slug, lang);
    }
}
