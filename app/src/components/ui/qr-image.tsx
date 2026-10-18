"use client";

import { type FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQrDataUrl } from "@/hooks/use-qr-data-url";
import { cn } from "@/lib/utils";

interface QrImageProps {
  value: string;
  size?: number;
  className?: string;
  alt?: string;
}

export const QrImage: FC<QrImageProps> = ({
  value,
  size = 240,
  className,
  alt = "QR code",
}) => {
  const src = useQrDataUrl(value, size);
  if (!src) {
    return <Skeleton className={cn("aspect-square w-full", className)} />;
  }
  return <img src={src} alt={alt} className={className} />;
};
