"use client";

import type { FC, ReactNode } from "react";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import { Label } from "@/components/ui/label";
import { NumberPicker } from "@/components/ui/number-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useTemplateEditor } from "@/app/dashboard/access/components/qr-templates/template-editor/template-editor-provider";
import type {
  TemplateFontWeight,
  TemplateTextAlign,
} from "@/features/qr-templates/interfaces/qr-template-elements.interfaces";

const FONT_WEIGHT_OPTIONS: { value: TemplateFontWeight; label: string }[] = [
  { value: 500, label: "Regular" },
  { value: 600, label: "Medium" },
  { value: 700, label: "Bold" },
  { value: 800, label: "Extra Bold" },
];

const ALIGN_OPTIONS: { value: TemplateTextAlign; icon: typeof AlignLeft }[] = [
  { value: "left", icon: AlignLeft },
  { value: "center", icon: AlignCenter },
  { value: "right", icon: AlignRight },
];

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function GeometryFields() {
  const { selectedElement, updateElement } = useTemplateEditor();
  if (!selectedElement) return null;
  const el = selectedElement;

  return (
    <div className="grid grid-cols-2 gap-3">
      <Field label="X">
        <NumberPicker
          size="sm"
          value={Math.round(el.x)}
          min={-500}
          max={800}
          onChange={(x) => updateElement(el.id, { x })}
        />
      </Field>
      <Field label="Y">
        <NumberPicker
          size="sm"
          value={Math.round(el.y)}
          min={-500}
          max={800}
          onChange={(y) => updateElement(el.id, { y })}
        />
      </Field>
      <Field label="Width">
        <NumberPicker
          size="sm"
          value={Math.round(el.width)}
          min={4}
          max={800}
          onChange={(width) => updateElement(el.id, { width })}
        />
      </Field>
      <Field label="Height">
        <NumberPicker
          size="sm"
          value={Math.round(el.height)}
          min={4}
          max={800}
          onChange={(height) => updateElement(el.id, { height })}
        />
      </Field>
    </div>
  );
}

export const TemplateInspectorPanel: FC = () => {
  const {
    selectedElement,
    canvas,
    updateCanvas,
    updateElement,
    defaultElements,
    defaultCanvas,
  } = useTemplateEditor();

  if (!selectedElement) {
    return (
      <div className="space-y-4 p-4">
        <h3 className="text-sm font-bold text-ink-charcoal">Background</h3>
        <ColorPicker
          label="Card background"
          value={canvas.backgroundColor}
          defaultValue={defaultCanvas.backgroundColor}
          onChange={(backgroundColor) => updateCanvas({ backgroundColor })}
        />
        <p className="text-xs text-zinc-400">
          Select an element on the card to edit it.
        </p>
      </div>
    );
  }

  const el = selectedElement;
  const defaultEl = defaultElements.find((item) => item.id === el.id);

  return (
    <div className="space-y-5 p-4">
      {el.kind === "text" ? (
        <>
          <Field label="Text">
            <Textarea
              rows={3}
              value={el.content}
              onChange={(event) =>
                updateElement(el.id, { content: event.target.value })
              }
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Font">
              <Select
                value={el.fontFamily}
                onValueChange={(value) =>
                  updateElement(el.id, {
                    fontFamily: value as "sans" | "serif",
                  })
                }
              >
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sans">Sans</SelectItem>
                  <SelectItem value="serif">Serif</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Weight">
              <Select
                value={String(el.fontWeight)}
                onValueChange={(value) =>
                  updateElement(el.id, {
                    fontWeight: Number(value) as TemplateFontWeight,
                  })
                }
              >
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_WEIGHT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={String(option.value)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Size">
              <NumberPicker
                size="sm"
                value={el.fontSize}
                min={8}
                max={72}
                onChange={(fontSize) => updateElement(el.id, { fontSize })}
              />
            </Field>
            <Field label="Letter spacing">
              <NumberPicker
                size="sm"
                value={el.letterSpacing}
                min={-2}
                max={12}
                step={0.5}
                onChange={(letterSpacing) =>
                  updateElement(el.id, { letterSpacing })
                }
              />
            </Field>
          </div>
          <Field label="Align">
            <div className="flex gap-1">
              {ALIGN_OPTIONS.map(({ value, icon: Icon }) => (
                <Button
                  key={value}
                  type="button"
                  size="icon-sm"
                  variant={el.align === value ? "secondary" : "outline"}
                  onClick={() => updateElement(el.id, { align: value })}
                >
                  <Icon className="size-3.5" />
                </Button>
              ))}
            </div>
          </Field>
          <ColorPicker
            label="Color"
            value={el.color}
            defaultValue={
              defaultEl?.kind === "text" ? defaultEl.color : undefined
            }
            onChange={(color) => updateElement(el.id, { color })}
          />
          <div className="flex items-center justify-between">
            <Label htmlFor="uppercase-switch">Uppercase</Label>
            <Switch
              id="uppercase-switch"
              checked={el.uppercase}
              onCheckedChange={(uppercase) =>
                updateElement(el.id, { uppercase: uppercase === true })
              }
            />
          </div>
        </>
      ) : null}

      {el.kind === "image" ? (
        <>
          <Field label="Shape">
            <Select
              value={el.shape}
              onValueChange={(value) =>
                updateElement(el.id, {
                  shape: value as "circle" | "square",
                })
              }
            >
              <SelectTrigger size="sm" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="square">Square</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className="flex items-center justify-between">
            <Label htmlFor="backdrop-switch">White backdrop</Label>
            <Switch
              id="backdrop-switch"
              checked={el.backdrop}
              onCheckedChange={(backdrop) =>
                updateElement(el.id, { backdrop: backdrop === true })
              }
            />
          </div>
          <ColorPicker
            label="Fallback icon color"
            value={el.iconColor}
            defaultValue={
              defaultEl?.kind === "image" ? defaultEl.iconColor : undefined
            }
            onChange={(iconColor) => updateElement(el.id, { iconColor })}
          />
          <p className="text-xs text-zinc-400">
            Shown when this store has no logo uploaded.
          </p>
        </>
      ) : null}

      {el.kind === "qr" ? (
        <div className="flex items-center justify-between">
          <Label htmlFor="qr-badge-switch">Show center badge</Label>
          <Switch
            id="qr-badge-switch"
            checked={el.showBadge}
            onCheckedChange={(showBadge) =>
              updateElement(el.id, { showBadge: showBadge === true })
            }
          />
        </div>
      ) : null}

      {el.kind === "iconRow" ? (
        <>
          <ColorPicker
            label="Color"
            value={el.color}
            defaultValue={
              defaultEl?.kind === "iconRow" ? defaultEl.color : undefined
            }
            onChange={(color) => updateElement(el.id, { color })}
          />
          <Field label="Label size">
            <NumberPicker
              size="sm"
              value={el.labelFontSize}
              min={6}
              max={20}
              onChange={(labelFontSize) =>
                updateElement(el.id, { labelFontSize })
              }
            />
          </Field>
        </>
      ) : null}

      {el.kind === "band" ? (
        <ColorPicker
          label="Color"
          value={el.color}
          defaultValue={
            defaultEl?.kind === "band" ? defaultEl.color : undefined
          }
          onChange={(color) => updateElement(el.id, { color })}
        />
      ) : null}

      <div className="border-t border-zinc-100 pt-4">
        <p className="mb-2 text-xs font-semibold text-zinc-500">
          Position &amp; size
        </p>
        <GeometryFields />
      </div>
    </div>
  );
};
