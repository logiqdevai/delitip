"use client"

import * as React from "react"
import { format, parseISO } from "date-fns"
import { useFormatter, useTranslations } from "next-intl"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  id?: string
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  size?: "default" | "sm"
  className?: string
  disabled?: boolean
  "aria-label"?: string
  "aria-invalid"?: boolean
}

function DatePicker({
  id,
  value,
  onChange,
  placeholder,
  size = "default",
  className,
  disabled,
  ...props
}: DatePickerProps) {
  const t = useTranslations("dashboard.shell.ui")
  const intlFormat = useFormatter()
  const [open, setOpen] = React.useState(false)
  const selected = value ? parseISO(value) : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            size={size}
            disabled={disabled}
            className={cn(
              "justify-start font-normal",
              !selected && "text-muted-foreground",
              className
            )}
            {...props}
          />
        }
      >
        <CalendarIcon data-icon="inline-start" />
        {selected
          ? intlFormat.dateTime(selected, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : (placeholder ?? t("pickDate"))}
      </PopoverTrigger>
      <PopoverContent
        className="w-auto max-w-[calc(100vw-2rem)] p-0"
        align="center"
        sideOffset={8}
        collisionPadding={16}
      >
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          onSelect={(date) => {
            onChange(date ? format(date, "yyyy-MM-dd") : "")
            setOpen(false)
          }}
          className="[--cell-size:--spacing(10)] sm:[--cell-size:--spacing(9)]"
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
