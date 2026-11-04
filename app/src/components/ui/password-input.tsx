"use client";

import { type ComponentProps, type FC, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

type PasswordInputProps = Omit<
  ComponentProps<typeof InputGroupInput>,
  "type"
> & {
  groupClassName?: string;
};

export const PasswordInput: FC<PasswordInputProps> = ({
  groupClassName,
  ...props
}) => {
  const t = useTranslations("dashboard.shell.ui");
  const [visible, setVisible] = useState(false);

  return (
    <InputGroup className={groupClassName}>
      <InputGroupInput type={visible ? "text" : "password"} {...props} />
      <InputGroupAddon align="inline-end">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={visible ? t("hidePassword") : t("showPassword")}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
};
