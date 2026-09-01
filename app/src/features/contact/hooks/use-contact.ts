import { useMutation } from "@tanstack/react-query";
import { submitContactForm } from "@/features/contact/services/contact.services";
import type { ContactPayload } from "@/features/contact/interfaces/contact.interfaces";
import { toast } from "@/components/ui/toast";

export const useSubmitContact = () => {
  return useMutation({
    mutationFn: (payload: ContactPayload) => submitContactForm(payload),
    onError: (error: Error) => {
      toast.add({
        title: "Could not send message",
        description: error.message,
        type: "error",
      });
    },
  });
};
