"use client";

import { type FC, type FormEvent, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultilingualInput } from "@/components/ui/multilingual-input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import type { Language } from "@/features/stores/interfaces/stores.interfaces";

interface MultilingualConfig {
  storeId: string;
  primaryLanguage: Language;
  languages: Language[];
  initialTranslations: Record<string, string>;
}

interface ReviewConfigItemEditDialogProps {
  title: string;
  textLabel: string;
  /** Plain single-language text. Ignored when `multilingual` is given. */
  initialText?: string;
  /** Edit the text as a per-language map instead of a single string. */
  multilingual?: MultilingualConfig;
  choiceLabel?: string;
  initialChoice?: string;
  choiceOptions?: { id: string; label: string }[];
  isPending: boolean;
  onClose: () => void;
  onSave: (values: {
    text: string;
    translations: Record<string, string>;
    choice: string;
  }) => void;
}

export const ReviewConfigItemEditDialog: FC<ReviewConfigItemEditDialogProps> = ({
  title,
  textLabel,
  initialText = "",
  multilingual,
  choiceLabel,
  initialChoice = "",
  choiceOptions,
  isPending,
  onClose,
  onSave,
}) => {
  const textId = useId();
  const [text, setText] = useState(initialText);
  const [translations, setTranslations] = useState(
    multilingual?.initialTranslations ?? {},
  );
  const [choice, setChoice] = useState(initialChoice);

  const primaryKey = multilingual?.primaryLanguage.toLowerCase() ?? "";
  const initialTranslations = multilingual?.initialTranslations ?? {};

  const trimmed = multilingual
    ? (translations[primaryKey]?.trim() ?? "")
    : text.trim();
  const textChanged = multilingual
    ? Object.keys({ ...initialTranslations, ...translations }).some(
        (key) =>
          (translations[key] ?? "").trim() !==
          (initialTranslations[key] ?? "").trim(),
      )
    : trimmed !== initialText.trim();
  const hasChanges = textChanged || choice !== initialChoice;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmed || !hasChanges) return;
    onSave({ text: trimmed, translations, choice });
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isPending) onClose();
      }}
    >
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor={textId}>{textLabel}</Label>
            {multilingual ? (
              <MultilingualInput
                id={textId}
                storeId={multilingual.storeId}
                languages={multilingual.languages}
                primaryLanguage={multilingual.primaryLanguage}
                value={translations}
                onValueChange={setTranslations}
                invalid={!trimmed}
                autoFocus
              />
            ) : (
              <Input
                id={textId}
                value={text}
                onChange={(event) => setText(event.target.value)}
                autoFocus
              />
            )}
          </div>
          {choiceOptions && choiceLabel ? (
            <div className="space-y-1.5">
              <Label>{choiceLabel}</Label>
              <Select
                items={choiceOptions.map((option) => ({
                  label: option.label,
                  value: option.id,
                }))}
                value={choice}
                onValueChange={(value) => {
                  if (value) setChoice(value);
                }}
              >
                <SelectTrigger className="h-(--control-height-default) w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {choiceOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !trimmed || !hasChanges}>
              {isPending ? <Spinner data-icon="inline-start" /> : null}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
