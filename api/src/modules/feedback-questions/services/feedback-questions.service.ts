import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { autoTranslateStub, TranslatedText } from '@/shared/utils/translation/translation.utils';
import { CreateFeedbackQuestionDto } from '../dto/create-feedback-question.dto';
import { UpdateFeedbackQuestionDto } from '../dto/update-feedback-question.dto';
import { FeedbackQuestionQueryType } from '../dto/feedback-question-query.schema';
import { FeedbackQuestionType, OrganizationRole } from 'generated/prisma';

const MANAGE_ROLES: OrganizationRole[] = [OrganizationRole.OWNER, OrganizationRole.STORE_MANAGER];

@Injectable()
export class FeedbackQuestionsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
    ) { }

    async create(user: AuthUser, storeId: string, dto: CreateFeedbackQuestionDto) {
        await this.accessControl.assertStoreAccess(user, storeId, MANAGE_ROLES);

        const store = await this.prisma.store.findUnique({ where: { id: storeId } });
        if (!store) throw new NotFoundException('Store not found');

        const question = autoTranslateStub(store.primary_language, dto.question, store.supported_languages);

        return this.prisma.feedbackQuestion.create({
            data: {
                store_id: storeId,
                question,
                type: dto.type ?? FeedbackQuestionType.RATING,
                sort_order: dto.sort_order ?? 0,
            },
        });
    }

    async findAll(user: AuthUser, storeId: string, query: FeedbackQuestionQueryType) {
        await this.accessControl.assertStoreAccess(user, storeId);

        return this.prisma.feedbackQuestion.findMany({
            where: {
                store_id: storeId,
                ...(query.is_active !== undefined && { is_active: query.is_active }),
            },
            orderBy: { sort_order: 'asc' },
        });
    }

    async update(user: AuthUser, storeId: string, id: string, dto: UpdateFeedbackQuestionDto) {
        await this.accessControl.assertStoreAccess(user, storeId, MANAGE_ROLES);

        const question = await this.prisma.feedbackQuestion.findFirst({ where: { id, store_id: storeId } });
        if (!question) throw new NotFoundException('Feedback question not found');

        let questionText = question.question;
        if (dto.question !== undefined) {
            const store = await this.prisma.store.findUnique({ where: { id: storeId } });
            if (!store) throw new NotFoundException('Store not found');
            questionText = autoTranslateStub(
                store.primary_language,
                dto.question,
                store.supported_languages,
                question.question as TranslatedText,
            );
        }

        return this.prisma.feedbackQuestion.update({
            where: { id },
            data: {
                ...(dto.question !== undefined && { question: questionText }),
                ...(dto.type !== undefined && { type: dto.type }),
                ...(dto.is_active !== undefined && { is_active: dto.is_active }),
                ...(dto.sort_order !== undefined && { sort_order: dto.sort_order }),
            },
        });
    }

    async remove(user: AuthUser, storeId: string, id: string) {
        await this.accessControl.assertStoreAccess(user, storeId, MANAGE_ROLES);

        const question = await this.prisma.feedbackQuestion.findFirst({ where: { id, store_id: storeId } });
        if (!question) throw new NotFoundException('Feedback question not found');

        await this.prisma.feedbackQuestion.delete({ where: { id } });
        return { success: true };
    }
}
