"use client";

import { type FC, type FormEvent, useState } from "react";
import { MessageSquareText, Plus, Star, Tag, Trash2 } from "lucide-react";
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
import {
  useCreateReviewCategory,
  useDeleteReviewCategory,
  useReviewCategories,
  useUpdateReviewCategory,
} from "@/features/review-categories/hooks/use-review-categories";
import {
  useCreateFeedbackQuestion,
  useDeleteFeedbackQuestion,
  useFeedbackQuestions,
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
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { resolvePrimaryText } from "@/lib/translated-text";
import { cn } from "@/lib/utils";

const CategoriesSection: FC<{ storeId: string; primaryLanguage?: string }> = ({ storeId, primaryLanguage }) => {
  const query = useReviewCategories(storeId);
  const create = useCreateReviewCategory(storeId);
  const update = useUpdateReviewCategory(storeId);
  const remove = useDeleteReviewCategory(storeId);
  const [name, setName] = useState("");
  const [pendingDelete, setPendingDelete] = useState<ReviewCategory | null>(null);
  const deleteConfirm = useConfirmationDialog();

  const items = query.data ?? [];

  const handleAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    create.mutate({ name: trimmed }, { onSuccess: () => setName("") });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
        <Star className="size-3.5 text-zinc-400" />
        Rating categories
      </div>
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Friendliness"
          className="flex-1"
        />
        <Button type="submit" disabled={create.isPending || !name.trim()}>
          <Plus data-icon="inline-start" />
          Add
        </Button>
      </form>
      {query.isPending ? (
        <Skeleton className="h-10 w-full rounded-lg" />
      ) : items.length === 0 ? (
        <p className="text-[11px] text-zinc-400">No categories yet.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className={cn(
                "flex items-center gap-1.5 rounded-full border py-1 pr-1.5 pl-3 text-xs",
                item.is_active
                  ? "border-zinc-200 bg-white text-ink-charcoal"
                  : "border-zinc-100 bg-zinc-50 text-zinc-400",
              )}
            >
              <button
                type="button"
                onClick={() => update.mutate({ id: item.id, payload: { is_active: !item.is_active } })}
                title={item.is_active ? "Deactivate" : "Activate"}
              >
                {resolvePrimaryText(item.name, primaryLanguage)}
              </button>
              <button
                type="button"
                className="flex size-5 items-center justify-center rounded-full text-zinc-400 hover:bg-red-50 hover:text-red-600"
                onClick={() => {
                  setPendingDelete(item);
                  deleteConfirm.openDialog();
                }}
                aria-label={`Delete ${resolvePrimaryText(item.name, primaryLanguage)}`}
              >
                <Trash2 className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <ConfirmationDialog
        state={deleteConfirm}
        title="Delete this rating category?"
        description={
          pendingDelete
            ? `"${resolvePrimaryText(pendingDelete.name, primaryLanguage)}" will no longer appear on the review step.`
            : undefined
        }
        confirmLabel="Delete"
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

const QuestionsSection: FC<{ storeId: string; primaryLanguage?: string }> = ({ storeId, primaryLanguage }) => {
  const query = useFeedbackQuestions(storeId);
  const create = useCreateFeedbackQuestion(storeId);
  const update = useUpdateFeedbackQuestion(storeId);
  const remove = useDeleteFeedbackQuestion(storeId);
  const [question, setQuestion] = useState("");
  const [type, setType] = useState<string>(FeedbackQuestionTypes.RATING);
  const [pendingDelete, setPendingDelete] = useState<FeedbackQuestion | null>(null);
  const deleteConfirm = useConfirmationDialog();

  const items = query.data ?? [];

  const handleAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;
    create.mutate(
      { question: trimmed, type: type as (typeof FeedbackQuestionTypes)[keyof typeof FeedbackQuestionTypes] },
      { onSuccess: () => setQuestion("") },
    );
  };

  return (
    <div className="space-y-2 border-t border-zinc-100 pt-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
        <MessageSquareText className="size-3.5 text-zinc-400" />
        Feedback questions
      </div>
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="e.g. How was the food?"
          className="flex-1"
        />
        <Select
          items={[
            { label: "Rating", value: FeedbackQuestionTypes.RATING },
            { label: "Text", value: FeedbackQuestionTypes.TEXT },
          ]}
          value={type}
          onValueChange={(value) => {
            if (value) setType(value);
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={FeedbackQuestionTypes.RATING}>Rating</SelectItem>
              <SelectItem value={FeedbackQuestionTypes.TEXT}>Text</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button type="submit" disabled={create.isPending || !question.trim()}>
          <Plus data-icon="inline-start" />
          Add
        </Button>
      </form>
      {query.isPending ? (
        <Skeleton className="h-10 w-full rounded-lg" />
      ) : items.length === 0 ? (
        <p className="text-[11px] text-zinc-400">No feedback questions yet.</p>
      ) : (
        <div className="divide-y divide-zinc-100">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-2 py-2 text-xs">
              <button
                type="button"
                onClick={() => update.mutate({ id: item.id, payload: { is_active: !item.is_active } })}
                className={cn(
                  "text-left",
                  item.is_active ? "text-ink-charcoal" : "text-zinc-400",
                )}
              >
                {resolvePrimaryText(item.question, primaryLanguage)}{" "}
                <span className="text-zinc-400">({item.type})</span>
              </button>
              <button
                type="button"
                className="flex size-5 items-center justify-center rounded-full text-zinc-400 hover:bg-red-50 hover:text-red-600"
                onClick={() => {
                  setPendingDelete(item);
                  deleteConfirm.openDialog();
                }}
                aria-label="Delete question"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <ConfirmationDialog
        state={deleteConfirm}
        title="Delete this feedback question?"
        description={
          pendingDelete
            ? `"${resolvePrimaryText(pendingDelete.question, primaryLanguage)}" will no longer appear on the review step.`
            : undefined
        }
        confirmLabel="Delete"
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
  const query = useReviewTags(storeId);
  const create = useCreateReviewTag(storeId);
  const update = useUpdateReviewTag(storeId);
  const remove = useDeleteReviewTag(storeId);
  const [name, setName] = useState("");
  const [sentiment, setSentiment] = useState<string>(ReviewTagSentiments.POSITIVE);
  const [pendingDelete, setPendingDelete] = useState<ReviewTag | null>(null);
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
        Compliment / feedback tags
      </div>
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Friendly service"
          className="flex-1"
        />
        <Select
          items={[
            { label: "Positive", value: ReviewTagSentiments.POSITIVE },
            { label: "Neutral", value: ReviewTagSentiments.NEUTRAL },
            { label: "Negative", value: ReviewTagSentiments.NEGATIVE },
          ]}
          value={sentiment}
          onValueChange={(value) => {
            if (value) setSentiment(value);
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={ReviewTagSentiments.POSITIVE}>Positive</SelectItem>
              <SelectItem value={ReviewTagSentiments.NEUTRAL}>Neutral</SelectItem>
              <SelectItem value={ReviewTagSentiments.NEGATIVE}>Negative</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button type="submit" disabled={create.isPending || !name.trim()}>
          <Plus data-icon="inline-start" />
          Add
        </Button>
      </form>
      {query.isPending ? (
        <Skeleton className="h-10 w-full rounded-lg" />
      ) : items.length === 0 ? (
        <p className="text-[11px] text-zinc-400">No tags yet.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className={cn(
                "flex items-center gap-1.5 rounded-full border py-1 pr-1.5 pl-3 text-xs",
                item.is_active
                  ? "border-zinc-200 bg-white text-ink-charcoal"
                  : "border-zinc-100 bg-zinc-50 text-zinc-400",
              )}
            >
              <button
                type="button"
                onClick={() => update.mutate({ id: item.id, payload: { is_active: !item.is_active } })}
              >
                {item.name}
              </button>
              <button
                type="button"
                className="flex size-5 items-center justify-center rounded-full text-zinc-400 hover:bg-red-50 hover:text-red-600"
                onClick={() => {
                  setPendingDelete(item);
                  deleteConfirm.openDialog();
                }}
                aria-label={`Delete ${item.name}`}
              >
                <Trash2 className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <ConfirmationDialog
        state={deleteConfirm}
        title="Delete this tag?"
        description={
          pendingDelete
            ? `"${pendingDelete.name}" will no longer be available to tag reviews.`
            : undefined
        }
        confirmLabel="Delete"
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
  const { store, storeId } = useWorkspace();
  if (!storeId) return null;

  const primaryLanguage = store?.primary_language?.toLowerCase();

  return (
    <div className="max-w-2xl space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs">
      <div>
        <h2 className="text-sm font-bold text-ink-charcoal">
          Reviews & feedback config
        </h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          What customers see on the review step after tipping.
        </p>
      </div>

      <CategoriesSection storeId={storeId} primaryLanguage={primaryLanguage} />
      <QuestionsSection storeId={storeId} primaryLanguage={primaryLanguage} />
      <TagsSection storeId={storeId} />
    </div>
  );
};
