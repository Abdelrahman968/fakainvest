import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { _Translator } from "next-intl";

interface SearchUser {
  id: string;
  name: string;
  email: string;
}

interface AddContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: SearchUser | null;
  onAddContact: () => void;
  getInitial: (name: string | undefined | null) => string;
  t: _Translator;
}

export default function AddContactDialog({
  open,
  onOpenChange,
  selectedUser,
  onAddContact,
  getInitial,
  t,
}: AddContactDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("addContact")}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-lg">
                {getInitial(selectedUser?.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{selectedUser?.name}</p>
              <p className="text-xs text-muted-foreground">
                {selectedUser?.email}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={onAddContact}>{t("addToContacts")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
