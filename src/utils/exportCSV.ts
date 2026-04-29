import type { Transfer } from "@/hooks/useWallet";

export const exportToCSV = (transactions: Transfer[]) => {
  const rows = [
    ["Date", "Type", "Counterparty", "Method", "Note", "Amount EGP"],
    ...transactions.map((t) => [
      new Date(t.created_at).toISOString(),
      t.type,
      t.counterparty,
      t.method,
      t.note,
      (t.type === "sent" || t.type === "card"
        ? -Number(t.amount)
        : Number(t.amount)
      ).toString(),
    ]),
  ];

  const csv = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transactions-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
