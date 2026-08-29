"use client";

import { type ComponentProps, type FC } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type ActionButtonWithPendingProps = ComponentProps<typeof Button> & {
  isPending?: boolean;
};

export const ActionButtonWithPending: FC<ActionButtonWithPendingProps> = ({
  isPending = false,
  disabled,
  children,
  ...props
}) => {
  return (
    <Button disabled={disabled || isPending} {...props}>
      {isPending ? <Spinner data-icon="inline-start" /> : null}
      {children}
    </Button>
  );
};
