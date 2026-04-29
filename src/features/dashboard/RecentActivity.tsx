"use client";

import { Link } from "@/i18n/navigation";
import RecentActivityItem from "./RecentActivityItem";
import { useTranslations } from "next-intl";

interface Transaction {
  id: string;
  merchant: string;
  category: string;
  roundUp?: number; // جعلها اختيارية
}

interface RecentActivityProps {
  transactions: Transaction[];
}

export default function RecentActivity({ transactions }: RecentActivityProps) {
  const t = useTranslations("DashboardPage");

  // تصفية المعاملات التي لها roundUp موجود وأكبر من 0
  const validTransactions = transactions.filter(
    (t) => t.roundUp && t.roundUp > 0,
  );

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">
          {t("recentRoundUps")}
        </h2>
        <Link
          href="/activity"
          className="text-xs font-semibold text-primary-glow"
        >
          {t("viewAll")}
        </Link>
      </div>
      <ul className="space-y-2">
        {validTransactions.length > 0 ? (
          validTransactions.map((t) => (
            <RecentActivityItem
              key={t.id}
              id={t.id}
              merchant={t.merchant}
              category={t.category}
              roundUp={t.roundUp}
            />
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            {t("noRecentRoundUps")}
          </p>
        )}
      </ul>
    </div>
  );
}
