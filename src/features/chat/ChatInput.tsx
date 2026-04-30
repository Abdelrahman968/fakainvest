"use client";

import { useForm } from "react-hook-form";
import { Send, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  sending: boolean;
  isArabic: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

interface FormValues {
  message: string;
}

export const ChatInput = ({
  input,
  setInput,
  onSend,
  sending,
  isArabic,
  inputRef,
}: ChatInputProps) => {
  const t = useTranslations("Chat");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      message: input,
    },
  });

  const message = watch("message");

  useEffect(() => {
    setValue("message", input);
  }, [input, setValue]);

  const onSubmit = (data: FormValues) => {
    if (!data.message.trim()) return;

    setInput(data.message);
    reset({ message: "" });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-2 flex items-center gap-2 rounded-2xl border border-border/50 bg-card/80 p-2 backdrop-blur-md"
    >
      <input
        {...register("message")}
        ref={(e) => {
          register("message").ref(e);
          if (inputRef) inputRef.current = e;
        }}
        placeholder={isArabic ? t("placeholder") : t("askAboutMoney")}
        dir={isArabic ? "rtl" : "ltr"}
        className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/60"
      />

      <button
        type="submit"
        disabled={!message?.trim() || sending || isSubmitting}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary-glow to-accent text-primary-foreground shadow-glow transition-all hover:scale-105 hover:shadow-glow-lg disabled:opacity-40 disabled:hover:scale-100"
      >
        {sending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </button>
    </form>
  );
};
