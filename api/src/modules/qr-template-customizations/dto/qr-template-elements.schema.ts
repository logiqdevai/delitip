import { z } from 'zod';

const HexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a 6-digit hex color');
// Loosely bounded on purpose: a drag/resize in progress can legitimately push
// an element slightly negative or past the 300x450 design canvas mid-edit.
const Coordinate = z.number().min(-2000).max(2000);
const Dimension = z.number().min(1).max(2000);

const TemplateElementBaseSchema = z.object({
    id: z.string().min(1).max(100),
    x: Coordinate,
    y: Coordinate,
    width: Dimension,
    height: Dimension,
});

export const TemplateTextElementSchema = TemplateElementBaseSchema.extend({
    kind: z.literal('text'),
    content: z.string().max(500),
    fontFamily: z.enum(['sans', 'serif']),
    fontSize: z.number().min(8).max(96),
    fontWeight: z.union([z.literal(500), z.literal(600), z.literal(700), z.literal(800)]),
    color: HexColor,
    align: z.enum(['left', 'center', 'right']),
    letterSpacing: z.number().min(-2).max(20),
    uppercase: z.boolean(),
    lineClamp: z.number().min(1).max(10).optional(),
});

export const TemplateImageElementSchema = TemplateElementBaseSchema.extend({
    kind: z.literal('image'),
    binding: z.literal('logo'),
    shape: z.enum(['circle', 'square']),
    backdrop: z.boolean(),
    iconColor: HexColor,
});

export const TemplateQrElementSchema = TemplateElementBaseSchema.extend({
    kind: z.literal('qr'),
    showBadge: z.boolean(),
});

export const TemplateIconRowElementSchema = TemplateElementBaseSchema.extend({
    kind: z.literal('iconRow'),
    variant: z.literal('scan-tip-review'),
    color: HexColor,
    labelFontSize: z.number().min(6).max(32),
});

export const TemplateBandElementSchema = TemplateElementBaseSchema.extend({
    kind: z.literal('band'),
    color: HexColor,
    borderRadius: z
        .object({
            topLeft: z.number().min(0).max(200),
            topRight: z.number().min(0).max(200),
            bottomLeft: z.number().min(0).max(200),
            bottomRight: z.number().min(0).max(200),
        })
        .optional(),
});

export const TemplateElementSchema = z.discriminatedUnion('kind', [
    TemplateTextElementSchema,
    TemplateImageElementSchema,
    TemplateQrElementSchema,
    TemplateIconRowElementSchema,
    TemplateBandElementSchema,
]);

export const TemplateCanvasConfigSchema = z.object({
    backgroundColor: HexColor,
});

export const UpsertQrTemplateCustomizationSchema = z.object({
    canvas: TemplateCanvasConfigSchema,
    elements: z.array(TemplateElementSchema).min(1).max(20),
});

export type TemplateElementType = z.infer<typeof TemplateElementSchema>;
export type TemplateCanvasConfigType = z.infer<typeof TemplateCanvasConfigSchema>;
export type UpsertQrTemplateCustomizationType = z.infer<typeof UpsertQrTemplateCustomizationSchema>;
