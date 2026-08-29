import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AccessControlModule } from '@/shared/services/access-control/access-control.module';
import { ReviewTagsController } from './review-tags.controller';
import { ReviewTagsService } from './services/review-tags.service';

@Module({
    imports: [PrismaModule, AccessControlModule],
    controllers: [ReviewTagsController],
    providers: [ReviewTagsService],
    exports: [ReviewTagsService],
})
export class ReviewTagsModule { }
