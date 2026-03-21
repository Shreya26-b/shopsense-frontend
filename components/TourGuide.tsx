// components/TourGuide.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const DASHBOARD_TOUR = [
  {
    element: "#tour-overview-header",
    popover: {
      title: "Overview Dashboard",
      description:
        "Your store command center. Every key metric visible at a glance.",
      side: "bottom" as const,
    },
  },
  {
    element: "#tour-metric-cards",
    popover: {
      title: "Key Metrics",
      description:
        "Total Revenue, Orders, Customers and Average Order Value from your store data.",
      side: "bottom" as const,
    },
  },
  {
    element: "#tour-revenue-chart",
    popover: {
      title: "Revenue Trend",
      description:
        "Monthly revenue over the last 6 months. Hover any point to see details.",
      side: "top" as const,
    },
  },
  {
    element: "#tour-products-chart",
    popover: {
      title: "Top Products",
      description: "Best performing products ranked by total revenue.",
      side: "top" as const,
    },
  },
  {
    element: "#tour-customers-table",
    popover: {
      title: "Top Customers",
      description:
        "Highest spending customers. Identify loyal buyers to reward.",
      side: "top" as const,
    },
  },
];

const PRODUCTS_TOUR = [
  {
    element: "#tour-products-header",
    popover: {
      title: "Products Page",
      description:
        "Every product with full sales performance — revenue, units sold, and stock.",
      side: "bottom" as const,
    },
  },
  {
    element: "#tour-products-table",
    popover: {
      title: "Product Table",
      description:
        "Stock in red means below 20 units — time to reorder! Revenue is total earned across all orders.",
      side: "top" as const,
    },
  },
];

const ANALYTICS_TOUR = [
  {
    element: "#tour-analytics-header",
    popover: {
      title: "Analytics Page",
      description:
        "Deep dive page. Unlike Overview, Analytics explains WHY your numbers are the way they are.",
      side: "bottom" as const,
    },
  },
  {
    element: "#tour-analytics-insights",
    popover: {
      title: "Key Insights",
      description:
        "Three unique metrics — month over month growth, best month and lowest month.",
      side: "bottom" as const,
    },
  },
  {
    element: "#tour-growth-card",
    popover: {
      title: "Month over Month Growth",
      description:
        "Green means revenue is growing. Red means it declined vs previous month.",
      side: "bottom" as const,
    },
  },
  {
    element: "#tour-best-month-card",
    popover: {
      title: "Best Month",
      description:
        "Your highest revenue month. Use as a benchmark — what worked that month?",
      side: "bottom" as const,
    },
  },
  {
    element: "#tour-worst-month-card",
    popover: {
      title: "Lowest Month",
      description:
        "Your weakest month. Plan promotions or restocking around slow periods.",
      side: "bottom" as const,
    },
  },
  {
    element: "#tour-monthly-table",
    popover: {
      title: "Month by Month Breakdown",
      description:
        "Revenue, orders, avg order value and % of total per month. Green row is your best month.",
      side: "top" as const,
    },
  },
  {
    element: "#tour-product-ranking",
    popover: {
      title: "Product Performance Ranking",
      description:
        "Every product ranked by revenue with a visual share bar showing % contribution.",
      side: "top" as const,
    },
  },
  {
    element: "#tour-customer-distribution",
    popover: {
      title: "Customer Spend Distribution",
      description:
        "High spend + high orders = loyal customer. High spend + low orders = re-engage them.",
      side: "top" as const,
    },
  },
];

const CHAT_TOUR = [
  {
    element: "#tour-chat-header",
    popover: {
      title: "AI Analytics Assistant",
      description:
        "Ask any question about your store in plain English. Answers from your real data.",
      side: "bottom" as const,
    },
  },
  {
    element: "#tour-suggested-questions",
    popover: {
      title: "Suggested Questions",
      description:
        "Click any to get started. The AI answers based on your actual store data.",
      side: "top" as const,
    },
  },
  {
    element: "#tour-chat-input",
    popover: {
      title: "Ask Anything",
      description:
        "Type your own question. Try: Which products should I restock? Who are my best customers?",
      side: "top" as const,
    },
  },
];

const IMPORT_TOUR = [
  {
    element: "#tour-import-header",
    popover: {
      title: "Import Your Data",
      description:
        "Upload products and orders as CSV files. This is how ShopSense learns your business.",
      side: "bottom" as const,
    },
  },
  {
    element: "#tour-rebuild-index",
    popover: {
      title: "Rebuild AI Index",
      description:
        "Click after every import. Updates the AI chatbot with your latest data.",
      side: "bottom" as const,
    },
  },
  {
    element: "#tour-import-type",
    popover: {
      title: "Choose Import Type",
      description:
        "Import products first, then orders. Orders reference product names.",
      side: "bottom" as const,
    },
  },
  {
    element: "#tour-csv-format",
    popover: {
      title: "CSV Format Guide",
      description: "Your CSV must match this column structure exactly.",
      side: "bottom" as const,
    },
  },
  {
    element: "#tour-file-upload",
    popover: {
      title: "Upload File",
      description:
        "Select your CSV. ShopSense validates every row and shows a summary after import.",
      side: "top" as const,
    },
  },
];

function getTourForPath(pathname: string) {
  if (pathname === "/dashboard") return DASHBOARD_TOUR;
  if (pathname === "/products") return PRODUCTS_TOUR;
  if (pathname === "/analytics") return ANALYTICS_TOUR;
  if (pathname === "/chat") return CHAT_TOUR;
  if (pathname === "/import") return IMPORT_TOUR;
  return null;
}

export default function TourGuide() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const key = `tour_seen_${pathname}`;
    const seen = localStorage.getItem(key);

    if (!seen) {
      const timer = setTimeout(() => startTour(), 1000);
      return () => clearTimeout(timer);
    }
  }, [mounted, pathname]);

  async function startTour() {
    const steps = getTourForPath(pathname);
    if (!steps || steps.length === 0) return;

    // Dynamically import driver.js — fixes production bundling issues
    const { driver } = await import("driver.js");

    const driverObj = driver({
      showProgress: true,
      showButtons: ["next", "previous", "close"],
      nextBtnText: "Next →",
      prevBtnText: "← Back",
      doneBtnText: "Done ✓",
      progressText: "{{current}} of {{total}}",
      popoverClass: "shopsense-tour",
      onDestroyed: () => {
        localStorage.setItem(`tour_seen_${pathname}`, "true");
      },
      steps,
    });

    driverObj.drive();
  }

  if (!mounted) return null;

  return (
    <button
      onClick={startTour}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
    >
      ? Tour
    </button>
  );
}
