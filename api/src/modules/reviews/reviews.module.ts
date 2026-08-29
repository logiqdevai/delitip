import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AccessControlModule } from '@/shared/services/access-control/access-control.module';
import { UsersModule } from '@/modules/users/users.module';
import { ReviewsController } from './reviews.controller';
import { PublicReviewsController } from './public-reviews.controller';
import { ReviewsService } from './services/reviews.service';

@Module({
    imports: [PrismaModule, AccessControlModule, UsersModule],
    controllers: [ReviewsController, PublicReviewsController],
    providers: [ReviewsService],
    exports: [ReviewsService],
})
export class ReviewsModule { }
