import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { _Translator } from "next-intl";

interface SearchUser {
  id: string;
  name: string;
  email: string;
}

interface SearchResultsProps {
  searching: boolean;
  searchResults: SearchUser[];
  onAddUser: (user: SearchUser) => void;
  getInitial: (name: string | undefined | null) => string;
  t: _Translator;
}

export default function SearchResults({
  searching,
  searchResults,
  onAddUser,
  getInitial,
  t,
}: SearchResultsProps) {
  return (
    <div className="rounded-2xl border border-border/40 bg-card/40 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold">{t("searchResults")}</p>
      </div>

      {searching ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : searchResults.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">
          {t("noUsersFound")}
        </p>
      ) : (
        <div className="space-y-2">
          {searchResults.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between rounded-xl p-3 hover:bg-secondary/40"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10">
                    {getInitial(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Button size="sm" onClick={() => onAddUser(user)}>
                <UserPlus className="h-4 w-4 mr-1" />
                {t("add")}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
