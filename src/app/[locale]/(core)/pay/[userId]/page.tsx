"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/hooks/useWallet";
import { useTranslations } from "next-intl";
import Link from "next/link";
import LoadingState from "@/features/pay/LoadingState";
import ErrorState from "@/features/pay/ErrorState";
import SelfPaymentState from "@/features/pay/SelfPaymentState";
import SuccessState from "@/features/pay/SuccessState";
import PaymentForm from "@/features/pay/PaymentForm";
import { UserProfilePay } from "@/types/UserProfilePay";

const PayUserPage = () => {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("PayPage");
  const userId = params.userId as string;
  const { user } = useAuth();
  const { send, refresh } = useWallet();

  const [recipient, setRecipient] = useState<UserProfilePay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchRecipient = async () => {
      try {
        const res = await fetch(`/api/users/${userId}`);

        if (!res.ok) {
          if (res.status === 404) {
            setError(t("userNotFound"));
          } else {
            const data = await res.json();
            setError(data.error || t("failedToLoadUser"));
          }
          return;
        }

        const data = await res.json();
        console.log("User data:", data);

        if (!data.user) {
          setError(t("userNotFound"));
          return;
        }

        setRecipient(data.user);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(t("networkError"));
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (userId && userId !== "undefined") {
        fetchRecipient();
      } else {
        setError(t("invalidUserId"));
        setLoading(false);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [userId, t]);

  const handleSend = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      toast.error(t("enterValidAmount"));
      return;
    }
    if (!recipient) return;

    setSending(true);
    const result = await send(amt, recipient._id, recipient.displayName, note);
    setSending(false);

    if (!result.ok) {
      toast.error(result.reason || t("paymentFailed"));
      return;
    }

    setSuccess(true);
    toast.success(
      t("sentSuccess", { amount: amt, name: recipient.displayName }),
    );
    await refresh();

    setTimeout(() => {
      router.push("/wallet");
    }, 3000);
  };

  const copyPaymentLink = () => {
    const link = `${window.location.origin}/pay/${user?.id}`;
    navigator.clipboard.writeText(link);
    toast.success(t("paymentLinkCopied"));
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !recipient) {
    return <ErrorState error={error} t={t} />;
  }

  const isSelf = user?.id === recipient._id;

  if (isSelf) {
    return <SelfPaymentState onCopyLink={copyPaymentLink} t={t} />;
  }

  if (success) {
    return <SuccessState amount={amount} recipient={recipient} t={t} />;
  }

  return (
    <div className="container max-w-md py-6">
      <Link
        href="/wallet"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToWallet")}
      </Link>

      <PaymentForm
        recipient={recipient}
        amount={amount}
        onAmountChange={setAmount}
        note={note}
        onNoteChange={setNote}
        onSend={handleSend}
        sending={sending}
        t={t}
      />
    </div>
  );
};

export default PayUserPage;
