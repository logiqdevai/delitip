"use client";

import {
  type FC,
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InFlowSelectOption {
  value: string;
  label: string;
}

interface InFlowSelectProps {
  id: string;
  value: string;
  options: InFlowSelectOption[];
  onValueChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const InFlowSelect: FC<InFlowSelectProps> = ({
  id,
  value,
  options,
  onValueChange,
  disabled = false,
  className,
}) => {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selected =
    options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const selectOption = (next: string) => {
    onValueChange(next);
    setOpen(false);
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div ref={rootRef} className={cn("space-y-1.5", className)}>
      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          "flex h-(--control-height-default) w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap ring-3 ring-transparent transition-[border-color,box-shadow,background-color] duration-200 ease-out outline-none select-none",
          "hover:bg-zinc-50 focus-visible:border-ring focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          open && "border-ring ring-ring/50",
        )}
      >
        <span className="min-w-0 flex-1 truncate text-left text-foreground">
          {selected?.label ?? ""}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
          open
            ? "grid-rows-[1fr] opacity-100"
            : "pointer-events-none grid-rows-[0fr] opacity-0",
        )}
        aria-hidden={!open}
      >
        <div className="overflow-hidden">
          <ul
            id={listId}
            role="listbox"
            aria-labelledby={id}
            className="max-h-48 overflow-y-auto rounded-lg border border-zinc-200 bg-popover p-1 text-popover-foreground"
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <li key={option.value.length === 0 ? "__empty" : option.value} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={open ? 0 : -1}
                    onClick={() => selectOption(option.value)}
                    className={cn(
                      "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1.5 pr-8 pl-2 text-left text-sm outline-hidden transition-colors",
                      "hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground",
                      isSelected && "bg-accent/70 font-medium text-accent-foreground",
                    )}
                  >
                    <span className="min-w-0 flex-1 truncate">{option.label}</span>
                    {isSelected ? (
                      <Check
                        className="pointer-events-none absolute right-2 size-4 text-brand-800"
                        aria-hidden
                      />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
