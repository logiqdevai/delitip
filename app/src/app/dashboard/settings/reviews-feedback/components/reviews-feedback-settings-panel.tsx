"use client";

import { type FC, type FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { MessageSquareText, Minus, Pencil, Plus, Star, Tag, ThumbsDown, ThumbsUp, Trash2, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ReviewConfigItemEditDialog } from "./review-config-item-edit-dialog";
import {
  SortableConfigList,
  SortableConfigRow,
} from "./sortable-config-list";
import {
  useCreateReviewCategory,
  useDeleteReviewCategory,
  useReorderReviewCategories,
  useReviewCategories,
  useUpdateReviewCategory,
} from "@/features/review-categories/hooks/use-review-categories";
import {
  useCreateFeedbackQuestion,
  useDeleteFeedbackQuestion,
  useFeedbackQuestions,
  useReorderFeedbackQuestions,
  useUpdateFeedbackQuestion,
} from "@/features/feedback-questions/hooks/use-feedback-questions";
import { FeedbackQuestionTypes } from "@/features/feedback-questions/interfaces/feedback-questions.interfaces";
import type { FeedbackQuestion } from "@/features/feedback-questions/interfaces/feedback-questions.interfaces";
import type { ReviewCategory } from "@/features/review-categories/interfaces/review-categories.interfaces";
import type { ReviewTag } from "@/features/review-tags/interfaces/review-tags.interfaces";
import {
  useCreateReviewTag,
  useDeleteReviewTag,
  useReviewTags,
  useUpdateReviewTag,
} from "@/features/review-tags/hooks/use-review-tags";
import { ReviewTagSentiments } from "@/features/review-tags/interfaces/review-tags.interfaces";
import { PlatformAuthRoles } from "@/features/auth/interfaces/auth.interfaces";
import { FeedbackQuestionTypeFormOptions } from "@/config/constants/dropdowns/reviews/feedback-question-type-form.options";
import { ReviewSentimentFormOptions } from "@/config/constants/dropdowns/reviews/review-sentiment-form.options";
import {
  useDropdownLabel,
  useDropdownOptions,
} from "@/hooks/use-dropdown-options";
import { useMe } from "@/features/users/hooks/use-users";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import type { Language } from "@/features/stores/interfaces/stores.interfaces";
import { useAuthStore } from "@/stores/auth.store";
import { resolvePrimaryText } from "@/lib/translated-text";
import { cn } from "@/lib/utils";

const VisibilityBadge: FC<{ isActive: boolean }> = ({ isActive }) => {
  const t = useTranslations("dashboard.settings.reviews");

  return (
    <span
      className={cn(
        "ml-1.5 inline-block w-fit max-w-fit shrink-0 self-start align-middle rounded-full px-2 py-0.5 text-[14px] font-bold",
        isActive
          ? "bg-brand-50 text-brand-700"
          : "bg-neutral-fill font-medium text-zinc-500",
      )}
    >
      {isActive ? t("shown") : t("hidden")}
    </span>
  );
};

const TagSentimentIcon: FC<{
  sentiment: string;
  isActive: boolean;
}> = ({ sentiment, isActive }) => {
  const t = useTranslations("dashboard.settings.reviews.tags");
  const optionLabel = useDropdownLabel();
  const label = optionLabel(ReviewSentimentFormOptions, sentiment);
  const Icon =
    sentiment === ReviewTagSentiments.POSITIVE
      ? ThumbsUp
      : sentiment === ReviewTagSentiments.NEGATIVE
        ? ThumbsDown
        : Minus;

  return (
    <span
      className={cn(
        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md sm:mt-0",
        isActive ? "bg-zinc-100 text-zinc-500" : "bg-zinc-50 text-zinc-300",
      )}
      title={label}
      aria-label={t("sentimentAria", { label })}
    >
      <Icon className="size-3" />
    </span>
  );
};

interface LanguageConfig {
  primary: Language;
  supported: Language[];
}

const CategoriesSection: FC<{
  storeId: string;
  primaryLanguage?: string;
  languageConfig: LanguageConfig;
}> = ({ storeId, primaryLanguage, languageConfig }) => {
  const t = useTranslations("dashboard.settings.reviews");
  const tCommon = useTranslations("dashboard.settings.common");
  const query = useReviewCategories(storeId);
  const create = useCreateReviewCategory(storeId);
  const update = useUpdateReviewCategory(storeId);
  const reorder = useReorderReviewCategories(storeId);
  const remove = useDeleteReviewCategory(storeId);
  const [name, setName] = useState("");
  const [pendingDelete, setPendingDelete] = useState<ReviewCategory | null>(null);
  const [editing, setEditing] = useState<ReviewCategory | null>(null);
  const deleteConfirm = useConfirmationDialog();

  const items = query.data ?? [];

  const handleAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const sort_order =
      items.reduce((max, item) => Math.max(max, item.sort_order), -1) + 1;
    create.mutate({ name: trimmed, sort_order }, { onSuccess: () => setName("") });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
        <Star className="size-3.5 text-zinc-400" />
        {t("categories.title")}
      </div>
      <p className="text-base text-zinc-400">
        {t("dragHint")}
      </p>
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={t("categories.placeholder")}
          className="flex-1"
        />
        <Button type="submit" disabled={create.isPending || !name.trim()}>
          <Plus data-icon="inline-start" />
          {tCommon("add")}
        </Button>
      </form>
      {query.isPending ? (
        <Skeleton className="h-10 w-full rounded-lg" />
      ) : items.length === 0 ? (
        <p className="text-base text-zinc-400">
          {t("categories.empty")}
        </p>
      ) : (
        <SortableConfigList
          itemIds={items.map((item) => item.id)}
          onReorder={(orderedIds) => reorder.mutate(orderedIds)}
        >
          {items.map((item) => {
            const label = resolvePrimaryText(item.name, primaryLanguage);
            const isUpdating =
              update.isPending && update.variables?.id === item.id;

            return (
              <SortableConfigRow
                key={item.id}
                id={item.id}
                className={cn(
                  "gap-3",
                  !item.is_active && "bg-zinc-50/80",
                )}
              >
                <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p
                    className={cn(
                      "min-w-0 flex-1 text-xs font-medium sm:truncate",
                      item.is_active ? "text-ink-charcoal" : "text-zinc-400",
                    )}
                  >
                    {label}
                    <VisibilityBadge isActive={item.is_active} />
                  </p>
                  <div className="flex shrink-0 items-center justify-end gap-2">
                    <Switch
                      size="sm"
                      checked={item.is_active}
                      disabled={isUpdating}
                      onCheckedChange={() =>
                        update.mutate({
                          id: item.id,
                          payload: { is_active: !item.is_active },
                        })
                      }
                      aria-label={
                        item.is_active
                          ? t("hideAria", { name: label })
                          : t("showAria", { name: label })
                      }
                    />
                    <button
                      type="button"
                      className="flex size-5 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                      onClick={() => setEditing(item)}
                      aria-label={t("editAria", { name: label })}
                    >
                      <Pencil className="size-3" />
                    </button>
                    <button
                      type="button"
                      className="flex size-5 items-center justify-center rounded-full text-zinc-400 hover:bg-red-50 hover:text-red-600"
                      onClick={() => {
                        setPendingDelete(item);
                        deleteConfirm.openDialog();
                      }}
                      aria-label={t("deleteAria", { name: label })}
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                </div>
              </SortableConfigRow>
            );
          })}
        </SortableConfigList>
      )}
      {editing ? (
        <ReviewConfigItemEditDialog
          key={editing.id}
          title={t("categories.editTitle")}
          textLabel={t("categories.nameLabel")}
          multilingual={{
            storeId,
            primaryLanguage: languageConfig.primary,
            languages: languageConfig.supported,
            initialTranslations: editing.name,
          }}
          isPending={update.isPending}
          onClose={() => setEditing(null)}
          onSave={({ translations }) =>
            update.mutate(
              { id: editing.id, payload: { name_translations: translations } },
              { onSuccess: () => setEditing(null) },
            )
          }
        />
      ) : null}
      <ConfirmationDialog
        state={deleteConfirm}
        title={t("categories.deleteTitle")}
        description={
          pendingDelete
            ? t("categories.deleteDescription", {
                name: resolvePrimaryText(pendingDelete.name, primaryLanguage),
              })
            : undefined
        }
        confirmLabel={tCommon("delete")}
        isPending={remove.isPending}
        onConfirm={async () => {
          if (!pendingDelete) return;
          await remove.mutateAsync(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
};

const QuestionsSection: FC<{
  storeId: string;
  primaryLanguage?: string;
  languageConfig: LanguageConfig;
}> = ({ storeId, primaryLanguage, languageConfig }) => {
  const t = useTranslations("dashboard.settings.reviews");
  const tCommon = useTranslations("dashboard.settings.common");
  const optionLabel = useDropdownLabel();
  const questionTypeOptions = useDropdownOptions(FeedbackQuestionTypeFormOptions);
  const query = useFeedbackQuestions(storeId);
  const create = useCreateFeedbackQuestion(storeId);
  const update = useUpdateFeedbackQuestion(storeId);
  const reorder = useReorderFeedbackQuestions(storeId);
  const remove = useDeleteFeedbackQuestion(storeId);
  const [question, setQuestion] = useState("");
  const [type, setType] = useState<string>(FeedbackQuestionTypes.RATING);
  const [pendingDelete, setPendingDelete] = useState<FeedbackQuestion | null>(null);
  const [editing, setEditing] = useState<FeedbackQuestion | null>(null);
  const deleteConfirm = useConfirmationDialog();

  const items = query.data ?? [];

  const handleAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;
    const sort_order =
      items.reduce((max, item) => Math.max(max, item.sort_order), -1) + 1;
    create.mutate(
      {
        question: trimmed,
        type: type as (typeof FeedbackQuestionTypes)[keyof typeof FeedbackQuestionTypes],
        sort_order,
      },
      { onSuccess: () => setQuestion("") },
    );
  };

  return (
    <div className="space-y-2 border-t border-zinc-100 pt-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
        <MessageSquareText className="size-3.5 text-zinc-400" />
        {t("questions.title")}
      </div>
      <p className="text-base text-zinc-400">
        {t("dragHint")}
      </p>
      <form onSubmit={handleAdd} className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={t("questions.placeholder")}
          className="w-full sm:flex-1"
        />
        <div className="flex items-center gap-2">
          <Select
            items={questionTypeOptions.map((option) => ({
              label: option.label,
              value: option.id,
            }))}
            value={type}
            onValueChange={(value) => {
              if (value) setType(value);
            }}
          >
            <SelectTrigger className="h-(--control-height-default) w-full sm:w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {questionTypeOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            type="submit"
            disabled={create.isPending || !question.trim()}
            className="shrink-0"
          >
            <Plus data-icon="inline-start" />
            {tCommon("add")}
          </Button>
        </div>
      </form>
      {query.isPending ? (
        <Skeleton className="h-10 w-full rounded-lg" />
      ) : items.length === 0 ? (
        <p className="text-base text-zinc-400">
          {t("questions.empty")}
        </p>
      ) : (
        <SortableConfigList
          itemIds={items.map((item) => item.id)}
          onReorder={(orderedIds) => reorder.mutate(orderedIds)}
        >
          {items.map((item) => {
            const label = resolvePrimaryText(item.question, primaryLanguage);
            const isUpdating =
              update.isPending && update.variables?.id === item.id;

            return (
              <SortableConfigRow
                key={item.id}
                id={item.id}
                className={cn(
                  "gap-3",
                  !item.is_active && "bg-zinc-50/80",
                )}
              >
                <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 flex-1 items-start gap-2 sm:items-center">
                    <span
                      className={cn(
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md sm:mt-0",
                        item.is_active
                          ? "bg-zinc-100 text-zinc-500"
                          : "bg-zinc-50 text-zinc-300",
                      )}
                      title={optionLabel(
                        FeedbackQuestionTypeFormOptions,
                        item.type,
                      )}
                      aria-label={t("questions.typeAria", {
                        label: optionLabel(
                          FeedbackQuestionTypeFormOptions,
                          item.type,
                        ),
                      })}
                    >
                      {item.type === FeedbackQuestionTypes.RATING ? (
                        <Star className="size-3" />
                      ) : (
                        <Type className="size-3" />
                      )}
                    </span>
                    <p
                      className={cn(
                        "min-w-0 flex-1 text-xs font-medium sm:truncate",
                        item.is_active ? "text-ink-charcoal" : "text-zinc-400",
                      )}
                    >
                      {label}
                      <VisibilityBadge isActive={item.is_active} />
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center justify-end gap-2">
                    <Switch
                      size="sm"
                      checked={item.is_active}
                      disabled={isUpdating}
                      onCheckedChange={() =>
                        update.mutate({
                          id: item.id,
                          payload: { is_active: !item.is_active },
                        })
                      }
                      aria-label={
                        item.is_active
                          ? t("hideAria", { name: label })
                          : t("showAria", { name: label })
                      }
                    />
                    <button
                      type="button"
                      className="flex size-5 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                      onClick={() => setEditing(item)}
                      aria-label={t("editAria", { name: label })}
                    >
                      <Pencil className="size-3" />
                    </button>
                    <button
                      type="button"
                      className="flex size-5 items-center justify-center rounded-full text-zinc-400 hover:bg-red-50 hover:text-red-600"
                      onClick={() => {
                        setPendingDelete(item);
                        deleteConfirm.openDialog();
                      }}
                      aria-label={t("deleteAria", { name: label })}
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                </div>
              </SortableConfigRow>
            );
          })}
        </SortableConfigList>
      )}
      {editing ? (
        <ReviewConfigItemEditDialog
          key={editing.id}
          title={t("questions.editTitle")}
          textLabel={t("questions.questionLabel")}
          multilingual={{
            storeId,
            primaryLanguage: languageConfig.primary,
            languages: languageConfig.supported,
            initialTranslations: editing.question,
          }}
          choiceLabel={t("questions.answerType")}
          initialChoice={editing.type}
          choiceOptions={questionTypeOptions}
          isPending={update.isPending}
          onClose={() => setEditing(null)}
          onSave={({ translations, choice }) =>
            update.mutate(
              {
                id: editing.id,
                payload: {
                  question_translations: translations,
                  type: choice as FeedbackQuestion["type"],
                },
              },
              { onSuccess: () => setEditing(null) },
            )
          }
        />
      ) : null}
      <ConfirmationDialog
        state={deleteConfirm}
        title={t("questions.deleteTitle")}
        description={
          pendingDelete
            ? t("questions.deleteDescription", {
                name: resolvePrimaryText(pendingDelete.question, primaryLanguage),
              })
            : undefined
        }
        confirmLabel={tCommon("delete")}
        isPending={remove.isPending}
        onConfirm={async () => {
          if (!pendingDelete) return;
          await remove.mutateAsync(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
};

const TagsSection: FC<{ storeId: string }> = ({ storeId }) => {
  const t = useTranslations("dashboard.settings.reviews");
  const tCommon = useTranslations("dashboard.settings.common");
  const sentimentOptions = useDropdownOptions(ReviewSentimentFormOptions);
  const query = useReviewTags(storeId);
  const create = useCreateReviewTag(storeId);
  const update = useUpdateReviewTag(storeId);
  const remove = useDeleteReviewTag(storeId);
  const [name, setName] = useState("");
  const [sentiment, setSentiment] = useState<string>(ReviewTagSentiments.POSITIVE);
  const [pendingDelete, setPendingDelete] = useState<ReviewTag | null>(null);
  const [editing, setEditing] = useState<ReviewTag | null>(null);
  const deleteConfirm = useConfirmationDialog();

  const items = query.data ?? [];

  const handleAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    create.mutate(
      { name: trimmed, sentiment: sentiment as (typeof ReviewTagSentiments)[keyof typeof ReviewTagSentiments] },
      { onSuccess: () => setName("") },
    );
  };

  return (
    <div className="space-y-2 border-t border-zinc-100 pt-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
        <Tag className="size-3.5 text-zinc-400" />
        {t("tags.title")}
      </div>
      <p className="text-base text-zinc-400">
        {t("tags.hint")}
      </p>
      <form onSubmit={handleAdd} className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={t("tags.placeholder")}
          className="w-full sm:flex-1"
        />
        <div className="flex items-center gap-2">
          <Select
            items={sentimentOptions.map((option) => ({
              label: option.label,
              value: option.id,
            }))}
            value={sentiment}
            onValueChange={(value) => {
              if (value) setSentiment(value);
            }}
          >
            <SelectTrigger className="h-(--control-height-default) w-full sm:w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {sentimentOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            type="submit"
            disabled={create.isPending || !name.trim()}
            className="shrink-0"
          >
            <Plus data-icon="inline-start" />
            {tCommon("add")}
          </Button>
        </div>
      </form>
      {query.isPending ? (
        <Skeleton className="h-10 w-full rounded-lg" />
      ) : items.length === 0 ? (
        <p className="text-base text-zinc-400">{t("tags.empty")}</p>
      ) : (
        <ul className="divide-y divide-zinc-100 rounded-xl border border-zinc-200/80">
          {items.map((item) => {
            const isUpdating =
              update.isPending && update.variables?.id === item.id;

            return (
              <li
                key={item.id}
                className={cn(
                  "flex items-start gap-3 px-3 py-2.5 sm:items-center",
                  !item.is_active && "bg-zinc-50/80",
                )}
              >
                <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 flex-1 items-start gap-2 sm:items-center">
                    {item.sentiment ? (
                      <TagSentimentIcon
                        sentiment={item.sentiment}
                        isActive={item.is_active}
                      />
                    ) : null}
                    <p
                      className={cn(
                        "min-w-0 flex-1 text-xs font-medium sm:truncate",
                        item.is_active ? "text-ink-charcoal" : "text-zinc-400",
                      )}
                    >
                      {item.name}
                      <VisibilityBadge isActive={item.is_active} />
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center justify-end gap-2">
                    <Switch
                      size="sm"
                      checked={item.is_active}
                      disabled={isUpdating}
                      onCheckedChange={() =>
                        update.mutate({
                          id: item.id,
                          payload: { is_active: !item.is_active },
                        })
                      }
                      aria-label={
                        item.is_active
                          ? t("hideAria", { name: item.name })
                          : t("showAria", { name: item.name })
                      }
                    />
                    <button
                      type="button"
                      className="flex size-5 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                      onClick={() => setEditing(item)}
                      aria-label={t("editAria", { name: item.name })}
                    >
                      <Pencil className="size-3" />
                    </button>
                    <button
                      type="button"
                      className="flex size-5 items-center justify-center rounded-full text-zinc-400 hover:bg-red-50 hover:text-red-600"
                      onClick={() => {
                        setPendingDelete(item);
                        deleteConfirm.openDialog();
                      }}
                      aria-label={t("deleteAria", { name: item.name })}
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {editing ? (
        <ReviewConfigItemEditDialog
          key={editing.id}
          title={t("tags.editTitle")}
          textLabel={t("tags.nameLabel")}
          initialText={editing.name}
          choiceLabel={t("tags.sentiment")}
          initialChoice={editing.sentiment ?? ReviewTagSentiments.NEUTRAL}
          choiceOptions={sentimentOptions}
          isPending={update.isPending}
          onClose={() => setEditing(null)}
          onSave={({ text, choice }) =>
            update.mutate(
              {
                id: editing.id,
                payload: {
                  name: text,
                  sentiment: choice as ReviewTag["sentiment"] & string,
                },
              },
              { onSuccess: () => setEditing(null) },
            )
          }
        />
      ) : null}
      <ConfirmationDialog
        state={deleteConfirm}
        title={t("tags.deleteTitle")}
        description={
          pendingDelete
            ? t("tags.deleteDescription", { name: pendingDelete.name })
            : undefined
        }
        confirmLabel={tCommon("delete")}
        isPending={remove.isPending}
        onConfirm={async () => {
          if (!pendingDelete) return;
          await remove.mutateAsync(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
};

export const ReviewsFeedbackSettingsPanel: FC = () => {
  const t = useTranslations("dashboard.settings.reviews");
  const { store, storeId } = useWorkspace();
  const authUser = useAuthStore((state) => state.user);
  const meQuery = useMe();
  if (!storeId) return null;

  const primaryLanguage = store?.primary_language?.toLowerCase();
  const languageConfig: LanguageConfig = {
    primary: store?.primary_language ?? "EN",
    supported: store?.supported_languages?.length
      ? store.supported_languages
      : [store?.primary_language ?? "EN"],
  };
  const platformRole = meQuery.data?.role ?? authUser?.role;
  const canManageTags =
    platformRole === PlatformAuthRoles.ADMIN ||
    platformRole === PlatformAuthRoles.SUPER_ADMIN;

  return (
    <div className="max-w-2xl space-y-4 rounded-2xl border border-zinc-200/80 bg-white px-4 py-6 shadow-xs">
      <div>
        <h2 className="text-sm font-bold text-ink-charcoal">
          {t("title")}
        </h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          {t("description")}
        </p>
      </div>

      <CategoriesSection
        storeId={storeId}
        primaryLanguage={primaryLanguage}
        languageConfig={languageConfig}
      />
      <QuestionsSection
        storeId={storeId}
        primaryLanguage={primaryLanguage}
        languageConfig={languageConfig}
      />
      {canManageTags ? <TagsSection storeId={storeId} /> : null}
    </div>
  );
};
