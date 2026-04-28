import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { SearchUser } from "@/types/Wallet.types";

interface RecipientSearchProps {
  value: string;
  onValueChange: (value: string) => void;
  searchResults: SearchUser[];
  onSelect: (id: string, name: string) => void;
  selectedId: string;
  selectedName: string;
  label: string;
}

export default function RecipientSearch({
  value,
  onValueChange,
  searchResults,
  onSelect,
  selectedId,
  selectedName,
  label,
}: RecipientSearchProps) {
  const t = useTranslations("WalletPage");

  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-muted-foreground">
        {label}
      </p>
      <Input
        placeholder={t("searchByNameOrEmail")}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="h-11 rounded-2xl"
      />
      {searchResults.length > 0 && (
        <div className="mt-2 max-h-48 space-y-1 overflow-y-auto rounded-xl border border-border/40 bg-card p-1">
          {searchResults.map((user) => (
            <button
              key={user.id}
              onClick={() => {
                onSelect(user.id, user.name);
                onValueChange("");
              }}
              className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-secondary/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              {selectedId === user.id && (
                <div className="h-2 w-2 rounded-full bg-accent" />
              )}
            </button>
          ))}
        </div>
      )}
      {selectedId && selectedName && (
        <div className="mt-2 rounded-xl bg-accent/10 p-2 text-center text-sm font-medium">
          {label}: {selectedName}
        </div>
      )}
    </div>
  );
}
