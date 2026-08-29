import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AccessControlModule } from '@/shared/services/access-control/access-control.module';
import { ReviewCategoriesController } from './review-categories.controller';
import { ReviewCategoriesService } from './services/review-categories.service';

@Module({
    imports: [PrismaModule, AccessControlModule],
    controllers: [ReviewCategoriesController],
    providers: [ReviewCategoriesService],
    exports: [ReviewCategoriesService],
})
export class ReviewCategoriesModule { }
