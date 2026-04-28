"use client";
import { useState, useEffect } from "react";
import { useWallet, type Transfer } from "@/hooks/useWallet";
import { useProfile } from "@/hooks/useProfile";
import { CardLimitsSheet } from "@/components/CardLimitsSheet";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Contact, PaymentRequestType, SearchUser } from "@/types/Wallet.types";
import LoadingState from "@/features/wallet/LoadingState";
import WalletHeader from "@/features/wallet/WalletHeader";
import QuickContacts from "@/features/wallet/QuickContacts";
import RecentTransfers from "@/features/wallet/RecentTransfers";
import VirtualCard from "@/features/wallet/VirtualCard";
import CardControls from "@/features/wallet/CardControls";
import CardLimits from "@/features/wallet/CardLimits";
import SendSheet from "@/features/wallet/SendSheet";
import RequestSheet from "@/features/wallet/RequestSheet";
import PaymentRequestsDialog from "@/features/wallet/PaymentRequestsDialog";
import DepositSheet from "@/features/wallet/DepositSheet";
import SimulatePurchaseSheet from "@/features/wallet/SimulatePurchaseSheet";

const Wallet = () => {
  const t = useTranslations("WalletPage");
  const {
    wallet,
    transfers,
    loading,
    deposit,
    send,
    cardSpend,
    setFrozen,
    refresh,
  } = useWallet();
  const { profile } = useProfile();

  const [showDetails, setShowDetails] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [topupOpen, setTopupOpen] = useState(false);
  const [limitsOpen, setLimitsOpen] = useState(false);
  const [simOpen, setSimOpen] = useState(false);
  const [requestsOpen, setRequestsOpen] = useState(false);

  const [sendAmount, setSendAmount] = useState("");
  const [sendTo, setSendTo] = useState("");
  const [sendToName, setSendToName] = useState("");

  const [requestAmount, setRequestAmount] = useState("");
  const [requestTo, setRequestTo] = useState("");
  const [requestToName, setRequestToName] = useState("");
  const [requestNote, setRequestNote] = useState("");

  const [topupAmount, setTopupAmount] = useState("500");
  const [simAmount, setSimAmount] = useState("250");
  const [simMerchant, setSimMerchant] = useState("Gourmet Market");
  const [busy, setBusy] = useState(false);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequestType[]>(
    [],
  );
  const [processingRequest, setProcessingRequest] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const loadContacts = () => {
      try {
        let currentContacts: Contact[] = [];
        const savedContacts = localStorage.getItem("saved_contacts");
        if (savedContacts) {
          const parsedContacts = JSON.parse(savedContacts);
          const quickContacts = parsedContacts
            .slice(0, 5)
            .map((c: Contact) => ({
              id: c.id,
              name: c.name,
              email: c.email,
              avatar: c.name?.charAt(0).toUpperCase(),
            }));
          setContacts(quickContacts);
          currentContacts = quickContacts;
        }
        const fetchApiContacts = async () => {
          try {
            const res = await fetch("/api/contacts");
            if (res.ok) {
              const data = await res.json();
              const apiContacts = data.contacts || [];
              const existingIds = new Set(currentContacts.map((c) => c.id));
              const newContacts = [...currentContacts];
              for (const apiContact of apiContacts.slice(0, 5)) {
                if (!existingIds.has(apiContact.id)) {
                  newContacts.push({
                    id: apiContact.id,
                    name: apiContact.name,
                    email: apiContact.email,
                    avatar: apiContact.name?.charAt(0).toUpperCase(),
                  });
                }
              }
              if (newContacts.length > 0) setContacts(newContacts.slice(0, 5));
            }
          } catch (error) {
            console.error("Error fetching API contacts:", error);
          }
        };
        fetchApiContacts();
      } catch (error) {
        console.error("Error loading contacts:", error);
      }
    };
    loadContacts();
  }, []);

  const fetchPaymentRequests = async () => {
    try {
      const res = await fetch("/api/wallet/request?type=received");
      if (res.ok) {
        const data = await res.json();
        setPaymentRequests(data.requests || []);
      }
    } catch (error) {
      console.error("Error fetching payment requests:", error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (requestsOpen) fetchPaymentRequests();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [requestsOpen]);

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(
        `/api/users/search?q=${encodeURIComponent(query)}`,
      );
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.users || []);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => searchUsers(searchQuery), 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSend = async () => {
    const amt = parseFloat(sendAmount);
    if (!amt || amt <= 0) return toast.error(t("enterValidAmount"));
    if (!sendTo) return toast.error(t("pickRecipient"));
    setBusy(true);
    const r = await send(amt, sendTo, sendToName);
    setBusy(false);
    if (r.ok === false) return toast.error(r.reason);
    toast.success(
      t("sentSuccess", { amount: amt, name: sendToName || sendTo }),
    );
    setSendOpen(false);
    setSendAmount("");
    setSendTo("");
    setSendToName("");
    setSearchQuery("");
    setSearchResults([]);
    await refresh();
  };

  const handleRequest = async () => {
    const amt = parseFloat(requestAmount);
    if (!amt || amt <= 0) return toast.error(t("enterValidAmount"));
    if (!requestTo) return toast.error(t("pickRecipient"));
    setBusy(true);
    try {
      const res = await fetch("/api/wallet/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amt, to: requestTo, note: requestNote }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(t("requestSent", { amount: amt, name: requestToName }));
      setRequestOpen(false);
      setRequestAmount("");
      setRequestTo("");
      setRequestToName("");
      setRequestNote("");
      setSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("requestFailed"));
    } finally {
      setBusy(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    setProcessingRequest(requestId);
    try {
      const res = await fetch("/api/wallet/request", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action: "accept" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(t("paymentSent"));
      await fetchPaymentRequests();
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("failedToAccept"));
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    setProcessingRequest(requestId);
    try {
      const res = await fetch("/api/wallet/request", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action: "reject" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(t("requestRejected"));
      await fetchPaymentRequests();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("failedToReject"));
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleTopup = async () => {
    const amt = parseFloat(topupAmount);
    if (!amt || amt <= 0) return toast.error(t("enterValidAmount"));
    setBusy(true);
    const r = await deposit(amt, "Bank Transfer");
    setBusy(false);
    if (r.ok === false) return toast.error(r.reason);
    toast.success(t("depositedSuccess", { amount: amt }));
    setTopupOpen(false);
    setTopupAmount("500");
    await refresh();
  };

  const handleSimulate = async () => {
    const amt = parseFloat(simAmount);
    if (!amt || amt <= 0) return toast.error(t("enterValidAmount"));
    setBusy(true);
    const r = await cardSpend(amt, simMerchant || "Merchant");
    setBusy(false);
    if (r.ok === false)
      return toast.error(t("transactionDeclined"), { description: r.reason });
    toast.success(t("cardCharged", { amount: amt }), {
      description: simMerchant,
    });
    setSimOpen(false);
    setSimAmount("250");
    await refresh();
  };

  const handleToggleFreeze = async () => {
    await setFrozen(!wallet?.frozen);
    toast.success(wallet?.frozen ? t("cardUnfrozen") : t("cardFrozen"));
    await refresh();
  };

  if (loading || !wallet) {
    return <LoadingState />;
  }

  const balance = Number(wallet.balance);
  const spentToday = Number(wallet.spent_today);
  const spentThisMonth = Number(wallet.spent_this_month);
  const dailyLimit = Number(wallet.daily_limit);
  const monthlyLimit = Number(wallet.monthly_limit);
  const cardHolder = (profile?.display_name || "Card Holder").toUpperCase();
  const cardNumber = wallet.card_last_four
    ? `**** **** **** ${wallet.card_last_four}`
    : "**** **** **** 9847";
  const cardFull = wallet.card_number || "5412 7823 1290 9847";

  return (
    <div className="space-y-5">
      <header className="hidden md:block">
        <p className="text-sm text-muted-foreground">
          {t("yourMoneyVirtualCard")}
        </p>
        <h2 className="font-display text-2xl font-bold">{t("wallet")}</h2>
      </header>

      <WalletHeader
        balance={balance}
        paymentRequestsCount={paymentRequests.length}
        onViewRequests={() => setRequestsOpen(true)}
        onSend={() => setSendOpen(true)}
        onRequest={() => setRequestOpen(true)}
        onDeposit={() => setTopupOpen(true)}
        userId={wallet.user_id}
      />

      <div className="grid gap-5 md:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <QuickContacts
            contacts={contacts}
            onSelectContact={(id, name) => {
              setSendTo(id);
              setSendToName(name);
              setSendOpen(true);
            }}
          />
          <RecentTransfers transfers={transfers as Transfer[]} />
        </div>

        <div className="space-y-4">
          <VirtualCard
            cardNumber={cardNumber}
            cardFull={cardFull}
            cardHolder={cardHolder}
            cardExpiry={wallet.card_expiry || "08/28"}
            cardCvv={wallet.card_cvv}
            frozen={wallet.frozen}
            showDetails={showDetails}
          />

          <CardControls
            showDetails={showDetails}
            onToggleDetails={() => setShowDetails(!showDetails)}
            cardFull={cardFull}
            frozen={wallet.frozen}
            onToggleFreeze={handleToggleFreeze}
            onOpenLimits={() => setLimitsOpen(true)}
          />

          <CardLimits
            spentToday={spentToday}
            dailyLimit={dailyLimit}
            spentThisMonth={spentThisMonth}
            monthlyLimit={monthlyLimit}
            perTransactionLimit={wallet.per_transaction_limit}
            onlineEnabled={wallet.online_enabled}
            contactlessEnabled={wallet.contactless_enabled}
            internationalEnabled={wallet.international_enabled}
            onAdjustLimits={() => setLimitsOpen(true)}
            onSimulatePurchase={() => setSimOpen(true)}
          />
        </div>
      </div>

      <SendSheet
        open={sendOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSendTo("");
            setSendToName("");
            setSendAmount("");
            setSearchQuery("");
            setSearchResults([]);
          }
          setSendOpen(open);
        }}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        searchResults={searchResults}
        sendTo={sendTo}
        sendToName={sendToName}
        onSelectRecipient={(id, name) => {
          setSendTo(id);
          setSendToName(name);
        }}
        sendAmount={sendAmount}
        onSendAmountChange={setSendAmount}
        balance={balance}
        onSend={handleSend}
        busy={busy}
      />

      <RequestSheet
        open={requestOpen}
        onOpenChange={(open) => {
          if (!open) {
            setRequestTo("");
            setRequestToName("");
            setRequestAmount("");
            setRequestNote("");
            setSearchQuery("");
            setSearchResults([]);
          }
          setRequestOpen(open);
        }}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        searchResults={searchResults}
        requestTo={requestTo}
        requestToName={requestToName}
        onSelectRecipient={(id, name) => {
          setRequestTo(id);
          setRequestToName(name);
        }}
        requestAmount={requestAmount}
        onRequestAmountChange={setRequestAmount}
        requestNote={requestNote}
        onRequestNoteChange={setRequestNote}
        onRequest={handleRequest}
        busy={busy}
      />

      <PaymentRequestsDialog
        open={requestsOpen}
        onOpenChange={setRequestsOpen}
        requests={paymentRequests}
        processingId={processingRequest}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
      />

      <DepositSheet
        open={topupOpen}
        onOpenChange={setTopupOpen}
        amount={topupAmount}
        onAmountChange={setTopupAmount}
        onDeposit={handleTopup}
        busy={busy}
      />

      <SimulatePurchaseSheet
        open={simOpen}
        onOpenChange={setSimOpen}
        merchant={simMerchant}
        onMerchantChange={setSimMerchant}
        amount={simAmount}
        onAmountChange={setSimAmount}
        onSimulate={handleSimulate}
        busy={busy}
      />

      <CardLimitsSheet open={limitsOpen} onOpenChange={setLimitsOpen} />
    </div>
  );
};

export default Wallet;
