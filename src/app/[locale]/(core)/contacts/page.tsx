"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, Loader2, History, RefreshCw, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations } from "next-intl";
import ContactCard from "@/features/contacts/ContactCard";
import SearchResults from "@/features/contacts/SearchResults";
import SendSheet from "@/features/contacts/SendSheet";
import AddContactDialog from "@/features/contacts/AddContactDialog";

interface Contact {
  id: string;
  name: string;
  email: string;
  isFavorite?: boolean;
  lastTransaction?: Date;
  addedAt?: string;
}

interface SearchUser {
  id: string;
  name: string;
  email: string;
}

const STORAGE_KEYS = {
  CONTACTS: "saved_contacts",
  FAVORITES: "favorite_contacts",
};

const ContactsPage = () => {
  const t = useTranslations("ContactsPage");
  const { user } = useAuth();
  const { send, refresh: refreshWallet } = useWallet();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [favorites, setFavorites] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [searching, setSearching] = useState(false);

  const [sendOpen, setSendOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [sendAmount, setSendAmount] = useState("");
  const [busy, setBusy] = useState(false);

  const [addContactOpen, setAddContactOpen] = useState(false);
  const [selectedUserToAdd, setSelectedUserToAdd] = useState<SearchUser | null>(
    null,
  );

  const saveContactsToStorage = useCallback((contactsList: Contact[]) => {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contactsList));
  }, []);

  const getContactsFromStorage = useCallback((): Contact[] => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    return saved ? JSON.parse(saved) : [];
  }, []);

  const saveFavoritesToStorage = useCallback((favoriteIds: string[]) => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favoriteIds));
  }, []);

  const getFavoritesFromStorage = useCallback((): string[] => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return saved ? JSON.parse(saved) : [];
  }, []);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      const savedContacts = getContactsFromStorage();
      const favoriteIds = getFavoritesFromStorage();

      const savedWithFavorites = savedContacts.map((c) => ({
        ...c,
        isFavorite: favoriteIds.includes(c.id),
      }));

      setContacts(savedWithFavorites);
      setFavorites(savedWithFavorites.filter((c) => c.isFavorite));

      setSyncing(true);
      const res = await fetch("/api/contacts");
      if (res.ok) {
        const data = await res.json();
        const transactionContacts = (data.contacts || []) as Contact[];

        const existingIds = new Set(savedContacts.map((c) => c.id));
        const newContacts = [...savedContacts];

        for (const tContact of transactionContacts) {
          if (!existingIds.has(tContact.id)) {
            newContacts.push({
              ...tContact,
              addedAt: new Date().toISOString(),
              isFavorite: favoriteIds.includes(tContact.id),
            });
          }
        }

        if (newContacts.length > savedContacts.length) {
          saveContactsToStorage(newContacts);
          const updatedWithFavorites = newContacts.map((c) => ({
            ...c,
            isFavorite: favoriteIds.includes(c.id),
          }));
          setContacts(updatedWithFavorites);
          setFavorites(updatedWithFavorites.filter((c) => c.isFavorite));
        }
      }
    } catch (error) {
      console.error("Error loading contacts:", error);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, [getContactsFromStorage, getFavoritesFromStorage, saveContactsToStorage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadContacts();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [loadContacts]);

  const searchUsers = useCallback(
    async (query: string) => {
      if (!user?.id) {
        console.warn("User not authenticated");
        return;
      }

      if (!query.trim() || query.length < 2) {
        setSearchResults([]);
        return;
      }

      setSearching(true);
      try {
        const res = await fetch(
          `/api/users/search?q=${encodeURIComponent(query)}`,
        );
        if (res.ok) {
          const data = await res.json();
          const existingIds = contacts.map((c) => c.id);
          const newUsers = (data.users || []).filter(
            (u: SearchUser) => !existingIds.includes(u.id) && u.id !== user?.id,
          );
          setSearchResults(newUsers);
        }
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setSearching(false);
      }
    },
    [contacts, user?.id],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchUsers]);

  const addContact = async () => {
    if (!selectedUserToAdd) return;

    const existingContacts = getContactsFromStorage();
    if (existingContacts.some((c) => c.id === selectedUserToAdd.id)) {
      toast.error(t("alreadyInContacts", { name: selectedUserToAdd.name }));
      setAddContactOpen(false);
      setSelectedUserToAdd(null);
      return;
    }

    const newContact: Contact = {
      id: selectedUserToAdd.id,
      name: selectedUserToAdd.name,
      email: selectedUserToAdd.email,
      addedAt: new Date().toISOString(),
      isFavorite: false,
    };

    const updatedContacts = [...existingContacts, newContact];
    saveContactsToStorage(updatedContacts);

    const favoriteIds = getFavoritesFromStorage();
    const updatedWithFavorites = updatedContacts.map((c) => ({
      ...c,
      isFavorite: favoriteIds.includes(c.id),
    }));
    setContacts(updatedWithFavorites);
    setFavorites(updatedWithFavorites.filter((c) => c.isFavorite));

    toast.success(t("contactAdded", { name: selectedUserToAdd.name }));
    setAddContactOpen(false);
    setSelectedUserToAdd(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  const toggleFavorite = (contact: Contact) => {
    const favoriteIds = getFavoritesFromStorage();
    let newFavorites;

    if (contact.isFavorite) {
      newFavorites = favoriteIds.filter((id) => id !== contact.id);
      toast.info(t("removedFromFavorites", { name: contact.name }));
    } else {
      newFavorites = [...favoriteIds, contact.id];
      toast.success(t("addedToFavorites", { name: contact.name }));
    }

    saveFavoritesToStorage(newFavorites);

    const updatedContacts = contacts.map((c) =>
      c.id === contact.id ? { ...c, isFavorite: !c.isFavorite } : c,
    );
    setContacts(updatedContacts);
    setFavorites(updatedContacts.filter((c) => c.isFavorite));

    const contactsWithoutFav = updatedContacts.map((c) => {
      const copy = { ...c };
      delete copy.isFavorite;
      return copy;
    });
    saveContactsToStorage(contactsWithoutFav);
  };

  const removeContact = (contact: Contact) => {
    const existingContacts = getContactsFromStorage();
    const newContacts = existingContacts.filter((c) => c.id !== contact.id);
    saveContactsToStorage(newContacts);

    const favoriteIds = getFavoritesFromStorage().filter(
      (id) => id !== contact.id,
    );
    saveFavoritesToStorage(favoriteIds);

    const updatedContacts = newContacts.map((c) => ({
      ...c,
      isFavorite: favoriteIds.includes(c.id),
    }));
    setContacts(updatedContacts);
    setFavorites(updatedContacts.filter((c) => c.isFavorite));

    toast.success(t("contactRemoved", { name: contact.name }));
  };

  const handleSend = async () => {
    const amt = parseFloat(sendAmount);
    if (!amt || amt <= 0) {
      toast.error(t("enterValidAmount"));
      return;
    }
    if (!selectedContact) return;

    setBusy(true);
    const result = await send(amt, selectedContact.id, selectedContact.name);
    setBusy(false);

    if (!result.ok) {
      toast.error(result.reason || t("failedToSend"));
      return;
    }

    toast.success(
      t("sentSuccess", { amount: amt, name: selectedContact.name }),
    );
    setSendOpen(false);
    setSendAmount("");
    setSelectedContact(null);
    await refreshWallet();
    await loadContacts();
  };

  const syncWithTransactions = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/contacts");
      if (res.ok) {
        const data = await res.json();
        const transactionContacts = (data.contacts || []) as Contact[];
        const savedContacts = getContactsFromStorage();
        const favoriteIds = getFavoritesFromStorage();
        const existingIds = new Set(savedContacts.map((c) => c.id));

        const newContacts = [...savedContacts];
        for (const tContact of transactionContacts) {
          if (!existingIds.has(tContact.id)) {
            newContacts.push({
              ...tContact,
              addedAt: new Date().toISOString(),
              isFavorite: favoriteIds.includes(tContact.id),
            });
          }
        }

        if (newContacts.length > savedContacts.length) {
          saveContactsToStorage(newContacts);
          const updatedWithFavorites = newContacts.map((c) => ({
            ...c,
            isFavorite: favoriteIds.includes(c.id),
          }));
          setContacts(updatedWithFavorites);
          setFavorites(updatedWithFavorites.filter((c) => c.isFavorite));
          toast.success(
            t("addedNewContacts", {
              count: newContacts.length - savedContacts.length,
            }),
          );
        } else {
          toast.info(t("noNewContacts"));
        }
      }
    } catch {
      toast.error(t("failedToSync"));
    } finally {
      setSyncing(false);
    }
  };

  const getInitial = (name: string | undefined | null) => {
    if (!name || typeof name !== "string" || name.length === 0) {
      return "?";
    }
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("contactsInfo", {
              count: contacts.length,
              favorites: favorites.length,
            })}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={syncWithTransactions}
          disabled={syncing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
          {t("sync")}
        </Button>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 rounded-2xl"
        />
      </div>

      {searchQuery.length >= 2 && (
        <SearchResults
          searching={searching}
          searchResults={searchResults}
          onAddUser={(user) => {
            setSelectedUserToAdd(user);
            setAddContactOpen(true);
          }}
          getInitial={getInitial}
          t={t}
        />
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-2xl">
          <TabsTrigger value="all">{t("allContacts")}</TabsTrigger>
          <TabsTrigger value="favorites">{t("favorites")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-2">
          {contacts.length === 0 ? (
            <div className="py-12 text-center">
              <History className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">{t("noContacts")}</p>
              <p className="text-sm text-muted-foreground">
                {t("noContactsHint")}
              </p>
            </div>
          ) : (
            contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onSend={() => {
                  setSelectedContact(contact);
                  setSendOpen(true);
                }}
                onToggleFavorite={() => toggleFavorite(contact)}
                onRemove={() => removeContact(contact)}
                getInitial={getInitial}
                t={t}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="favorites" className="mt-4 space-y-2">
          {favorites.length === 0 ? (
            <div className="py-12 text-center">
              <Star className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">{t("noFavorites")}</p>
              <p className="text-sm text-muted-foreground">
                {t("noFavoritesHint")}
              </p>
            </div>
          ) : (
            favorites.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onSend={() => {
                  setSelectedContact(contact);
                  setSendOpen(true);
                }}
                onToggleFavorite={() => toggleFavorite(contact)}
                onRemove={() => removeContact(contact)}
                getInitial={getInitial}
                t={t}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      <SendSheet
        open={sendOpen}
        onOpenChange={setSendOpen}
        selectedContact={selectedContact}
        sendAmount={sendAmount}
        onSendAmountChange={setSendAmount}
        onSend={handleSend}
        busy={busy}
        t={t}
      />

      <AddContactDialog
        open={addContactOpen}
        onOpenChange={setAddContactOpen}
        selectedUser={selectedUserToAdd}
        onAddContact={addContact}
        getInitial={getInitial}
        t={t}
      />
    </div>
  );
};

export default ContactsPage;
