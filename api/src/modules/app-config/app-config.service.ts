import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { APP_CONFIG_ID } from '@/shared/config/platform-finance/platform-finance.config';
import { UpdateAppConfigDto } from './dto/update-app-config.dto';

@Injectable()
export class AppConfigService {
    constructor(private readonly prisma: PrismaService) {}

    get() {
        return this.prisma.appConfig.upsert({
            where: { id: APP_CONFIG_ID },
            create: { id: APP_CONFIG_ID },
            update: {},
        });
    }

    // Changing a value only affects future tips — every PaymentTransaction
    // snapshots the percentage it used, so past rows are never recomputed.
    update(userId: string, dto: UpdateAppConfigDto) {
        return this.prisma.appConfig.upsert({
            where: { id: APP_CONFIG_ID },
            create: { id: APP_CONFIG_ID, ...dto, updated_by_user_id: userId },
            update: { ...dto, updated_by_user_id: userId },
        });
    }
}
