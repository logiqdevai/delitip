"use client"

import * as React from "react"
import { format, parseISO } from "date-fns"
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
  placeholder = "Pick a date",
  size = "default",
  className,
  disabled,
  ...props
}: DatePickerProps) {
  const selected = value ? parseISO(value) : undefined

  return (
    <Popover>
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
        {selected ? format(selected, "MMM d, yyyy") : placeholder}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) =>
            onChange(date ? format(date, "yyyy-MM-dd") : "")
          }
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
