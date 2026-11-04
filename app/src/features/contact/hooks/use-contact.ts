import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { submitContactForm } from "@/features/contact/services/contact.services";
import type { ContactPayload } from "@/features/contact/interfaces/contact.interfaces";
import { toast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/api-error";

export const useSubmitContact = () => {
  const t = useTranslations("dashboard.shell.toasts.contact");
  return useMutation({
    mutationFn: (payload: ContactPayload) => submitContactForm(payload),
    onError: (error: Error) => {
      toast.add({
        title: t("sendFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};
