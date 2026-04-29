import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Star, StarOff, Trash2 } from "lucide-react";
import { _Translator } from "next-intl";

interface Contact {
  id: string;
  name: string;
  email: string;
  isFavorite?: boolean;
  lastTransaction?: Date;
}

interface ContactCardProps {
  contact: Contact;
  onSend: () => void;
  onToggleFavorite: () => void;
  onRemove: () => void;
  getInitial: (name: string | undefined | null) => string;
  t: _Translator;
}

export default function ContactCard({
  contact,
  onSend,
  onToggleFavorite,
  onRemove,
  getInitial,
  t,
}: ContactCardProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-2xl border border-border/40 bg-card/40 p-4 transition-all hover:bg-card/60">
      <Link
        href={`/pay/${contact.id}`}
        className="flex items-center gap-3 flex-1"
      >
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary/10 text-lg">
            {getInitial(contact.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold">{contact.name}</p>
            {contact.isFavorite && (
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">{contact.email}</p>
          {contact.lastTransaction && (
            <p className="text-[10px] text-muted-foreground">
              {t("lastTransaction")}:{" "}
              {new Date(contact.lastTransaction).toLocaleDateString()}
            </p>
          )}
        </div>
      </Link>
      <div className="sm:mt-0 mt-2 flex gap-1 self-end">
        <Button
          size="sm"
          variant="ghost"
          onClick={onSend}
          className="h-9 w-9 rounded-xl p-0"
          title={t("sendMoney")}
        >
          <Send className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onToggleFavorite}
          className="h-9 w-9 rounded-xl p-0"
          title={
            contact.isFavorite ? t("removeFromFavorites") : t("addToFavorites")
          }
        >
          {contact.isFavorite ? (
            <StarOff className="h-4 w-4 text-yellow-500" />
          ) : (
            <Star className="h-4 w-4" />
          )}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onRemove}
          className="h-9 w-9 rounded-xl p-0 text-destructive hover:text-destructive"
          title={t("removeContact")}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
