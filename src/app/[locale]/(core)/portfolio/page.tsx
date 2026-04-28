"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useHoldings } from "@/hooks/useHoldings";
import PortfolioHeader from "@/features/portfolio/PortfolioHeader";
import TotalValueCard from "@/features/portfolio/TotalValueCard";
import AllocationChart from "@/features/portfolio/AllocationChart";
import HoldingsList from "@/features/portfolio/HoldingsList";
import type { Range } from "@/types/portfolio";

const Portfolio = () => {
  const [range, setRange] = useState<Range>("1m");
  const [portfolioReturn, setPortfolioReturn] = useState<number>(0);
  const [returnLoading, setReturnLoading] = useState(false);

  const { holdings, loading: holdingsLoading } = useHoldings();

  const total = useMemo(() => {
    return holdings.reduce((s, h) => s + h.amount, 0);
  }, [holdings]);

  useEffect(() => {
    const fetchPortfolioReturns = async () => {
      if (holdings.length === 0) {
        setPortfolioReturn(0);
        return;
      }

      setReturnLoading(true);
      try {
        const response = await fetch(`/api/portfolio/returns?range=${range}`);
        if (response.ok) {
          const data = await response.json();
          setPortfolioReturn(data.return);
        }
      } catch (error) {
        console.error("Error fetching returns:", error);
      } finally {
        setReturnLoading(false);
      }
    };

    fetchPortfolioReturns();
  }, [range, holdings]);

  if (holdingsLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PortfolioHeader />

      <TotalValueCard
        total={total}
        portfolioReturn={portfolioReturn}
        range={range}
        onRangeChange={setRange}
        loading={returnLoading}
      />

      <AllocationChart holdings={holdings} />

      <HoldingsList holdings={holdings} />
    </div>
  );
};

export default Portfolio;
