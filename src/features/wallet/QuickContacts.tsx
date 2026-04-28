import { Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Contact } from "@/types/Wallet.types";

interface QuickContactsProps {
  contacts: Contact[];
  onSelectContact: (id: string, name: string) => void;
}

export default function QuickContacts({
  contacts,
  onSelectContact,
}: QuickContactsProps) {
  const t = useTranslations("WalletPage");

  return (
    <div className="glass-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold">{t("quickContacts")}</p>
        <Link
          href="/transactions"
          className="text-[11px] font-semibold text-primary-glow hover:underline"
        >
          {t("allTransactions")} →
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        <Link href="/contacts">
          <button className="flex shrink-0 flex-col items-center gap-1.5">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-dashed border-border bg-card/40">
              <Users className="h-5 w-5 text-muted-foreground" />
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">
              {t("all")}
            </span>
          </button>
        </Link>
        {contacts.slice(0, 6).map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectContact(c.id, c.name)}
            className="flex shrink-0 flex-col items-center gap-1.5"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-xl font-semibold ring-1 ring-border/60 transition-all hover:ring-primary-glow">
              {c.avatar || c.name.charAt(0).toUpperCase()}
            </span>
            <span className="text-[11px] font-medium">
              {c.name.split(" ")[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
