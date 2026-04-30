import { useMemo } from "react";
import {
  ChartLine,
  Gem,
  Activity,
  PiggyBank,
  TrendingUp,
  Target,
  Wallet,
  Shield,
} from "lucide-react";
import { ChatContext } from "@/types/chat";
import { useTranslations } from "next-intl";

export const useChatSuggestions = (
  locale: string,
  context: ChatContext | null
) => {
  const t = useTranslations("Chat");

  return useMemo(() => {
    const suggestions = [];

    suggestions.push({
      text: t("analyzeSpending"),
      icon: <ChartLine className="h-3.5 w-3.5" />,
    });
    suggestions.push({
      text: t("investGold"),
      icon: <Gem className="h-3.5 w-3.5" />,
    });
    suggestions.push({
      text: t("explainHealthScore"),
      icon: <Activity className="h-3.5 w-3.5" />,
    });

    if (context?.pendingRoundUps && context.pendingRoundUps > 0) {
      suggestions.push({
        text: t("pendingRoundups", { amount: context.pendingRoundUps }),
        icon: <PiggyBank className="h-3.5 w-3.5" />,
      });
    }

    if (context?.balance && context.balance > 0) {
      suggestions.push({
        text: t("investFromBalance", {
          amount: Math.floor(context.balance * 0.2),
        }),
        icon: <TrendingUp className="h-3.5 w-3.5" />,
      });
    }

    if (
      context?.healthScore &&
      context.healthScore < 70 &&
      context.healthScore > 0
    ) {
      suggestions.push({
        text: t("improveHealthScore"),
        icon: <Activity className="h-3.5 w-3.5" />,
      });
    }

    suggestions.push({
      text: t("saveTarget"),
      icon: <Target className="h-3.5 w-3.5" />,
    });
    suggestions.push({
      text: t("dailySavingTips"),
      icon: <PiggyBank className="h-3.5 w-3.5" />,
    });
    suggestions.push({
      text: t("sukukVsStocks"),
      icon: <Shield className="h-3.5 w-3.5" />,
    });
    suggestions.push({
      text: t("increaseSavingPoints"),
      icon: <Wallet className="h-3.5 w-3.5" />,
    });

    return suggestions.slice(0, 6);
  }, [locale, context, t]);
};