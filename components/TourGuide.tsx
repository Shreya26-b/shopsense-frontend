// components/TourGuide.tsx
"use client"

import { useEffect, useState } from "react"
import { driver } from "driver.js"
import "driver.js/dist/driver.css"
import { usePathname } from "next/navigation"

// ── Tour definitions per page ─────────────────────────────

const DASHBOARD_TOUR = [
  {
    element:  "#tour-overview-header",
    popover: {
      title:       "Overview Dashboard",
      description: "This is your store's command center. Every key metric is visible at a glance — updated in real time from your imported data.",
      side:        "bottom" as const,
    }
  },
  {
    element:  "#tour-metric-cards",
    popover: {
      title:       "Key Metrics",
      description: "Four headline numbers: Total Revenue, Total Orders, Unique Customers, and Average Order Value — all calculated from your store data.",
      side:        "bottom" as const,
    }
  },
  {
    element:  "#tour-revenue-chart",
    popover: {
      title:       "Revenue Trend",
      description: "This line chart shows your monthly revenue over the last 6 months. Hover over any point to see the exact revenue and order count for that month.",
      side:        "top" as const,
    }
  },
  {
    element:  "#tour-products-chart",
    popover: {
      title:       "Top Products",
      description: "Your best performing products ranked by total revenue. The longer the bar the more revenue that product has generated.",
      side:        "top" as const,
    }
  },
  {
    element:  "#tour-customers-table",
    popover: {
      title:       "Top Customers",
      description: "Your highest spending customers. Use this to identify loyal buyers you can reward with discounts or early access.",
      side:        "top" as const,
    }
  },
]

const PRODUCTS_TOUR = [
  {
    element:  "#tour-products-header",
    popover: {
      title:       "Products Page",
      description: "Every product in your store with full sales performance data — revenue, units sold, and current stock levels.",
      side:        "bottom" as const,
    }
  },
  {
    element:  "#tour-products-table",
    popover: {
      title:       "Product Table",
      description: "Click any column header to sort. Stock numbers shown in red mean below 20 units — time to reorder! Revenue is the total earned from this product across all orders.",
      side:        "top" as const,
    }
  },
]

const ANALYTICS_TOUR = [
  {
    element:  "#tour-analytics-header",
    popover: {
      title:       "Analytics Page",
      description: "This is your deep dive page. Unlike the Overview which shows a quick snapshot, Analytics explains WHY your numbers are the way they are — with detailed breakdowns and patterns.",
      side:        "bottom" as const,
    }
  },
  {
    element:  "#tour-analytics-insights",
    popover: {
      title:       "Key Insights",
      description: "Three unique metrics you won't find on the Overview page. Month over month growth tells you if your business is accelerating or slowing down. Best and lowest months help you spot seasonality.",
      side:        "bottom" as const,
    }
  },
  {
    element:  "#tour-growth-card",
    popover: {
      title:       "Month over Month Growth",
      description: "Compares your most recent month to the one before it. Green means your revenue is growing. Red means it declined. Use this to quickly spot if you need to take action.",
      side:        "bottom" as const,
    }
  },
  {
    element:  "#tour-best-month-card",
    popover: {
      title:       "Best Month",
      description: "Your highest revenue month in the last 6 months. Use this as a benchmark — can you replicate what worked that month? Were there promotions or seasonal factors?",
      side:        "bottom" as const,
    }
  },
  {
    element:  "#tour-worst-month-card",
    popover: {
      title:       "Lowest Month",
      description: "Your weakest month. This is not necessarily bad — every business has slow periods. Knowing when they happen lets you plan promotions or inventory restocking in advance.",
      side:        "bottom" as const,
    }
  },
  {
    element:  "#tour-monthly-table",
    popover: {
      title:       "Month by Month Breakdown",
      description: "Every month shown with revenue, order count, average order value, and percentage of your total revenue. The green highlighted row is your best month. The % of Total column shows which months drive the most business.",
      side:        "top" as const,
    }
  },
  {
    element:  "#tour-product-ranking",
    popover: {
      title:       "Product Performance Ranking",
      description: "Every product ranked by revenue with a visual share bar. The bar shows what percentage of your total revenue each product contributes. Products at the top are your revenue drivers — protect their stock levels.",
      side:        "top" as const,
    }
  },
  {
    element:  "#tour-customer-distribution",
    popover: {
      title:       "Customer Spend Distribution",
      description: "Every customer ranked by total spend with average spend per order and their share of your total revenue. High total spend + high order count = loyal customer worth rewarding. High spend + low order count = high value but infrequent buyer to re-engage.",
      side:        "top" as const,
    }
  },
]

const CHAT_TOUR = [
  {
    element:  "#tour-chat-header",
    popover: {
      title:       "AI Analytics Assistant",
      description: "Ask any question about your store data in plain English. The AI reads your actual products and orders — no generic answers.",
      side:        "bottom" as const,
    }
  },
  {
    element:  "#tour-suggested-questions",
    popover: {
      title:       "Suggested Questions",
      description: "Click any of these to get started instantly. The AI will answer based on your real store data.",
      side:        "top" as const,
    }
  },
  {
    element:  "#tour-chat-input",
    popover: {
      title:       "Ask Anything",
      description: "Type your own question here. Try: 'Which products should I restock?', 'Who are my best customers?', or 'What was my best sales month?'",
      side:        "top" as const,
    }
  },
]

const IMPORT_TOUR = [
  {
    element:  "#tour-import-header",
    popover: {
      title:       "Import Your Data",
      description: "Upload your store's products and orders as CSV files. This is how ShopSense learns about your business.",
      side:        "bottom" as const,
    }
  },
  {
    element:  "#tour-rebuild-index",
    popover: {
      title:       "Rebuild AI Index",
      description: "After every import click this button. It updates the AI chatbot with your latest data so it can answer questions accurately.",
      side:        "bottom" as const,
    }
  },
  {
    element:  "#tour-import-type",
    popover: {
      title:       "Choose Import Type",
      description: "Import products first, then orders. Orders reference product names so products must exist before importing orders.",
      side:        "bottom" as const,
    }
  },
  {
    element:  "#tour-csv-format",
    popover: {
      title:       "CSV Format Guide",
      description: "Your CSV must match this exact column structure. Export from Shopify, WooCommerce, or any platform and reformat to match.",
      side:        "bottom" as const,
    }
  },
  {
    element:  "#tour-file-upload",
    popover: {
      title:       "Upload File",
      description: "Select your CSV file here. After upload ShopSense validates every row and skips any with errors — showing you a summary at the end.",
      side:        "top" as const,
    }
  },
]

// ── Page to tour mapping ──────────────────────────────────
function getTourForPath(pathname: string) {
  if (pathname === "/dashboard")  return DASHBOARD_TOUR
  if (pathname === "/products")   return PRODUCTS_TOUR
  if (pathname === "/analytics")  return ANALYTICS_TOUR
  if (pathname === "/chat")       return CHAT_TOUR
  if (pathname === "/import")     return IMPORT_TOUR
  return null
}

// ── Tour Guide Component ──────────────────────────────────
export default function TourGuide() {
  const pathname                    = usePathname()
  const [tourSeen, setTourSeen]     = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    // Check if user has seen the tour for this page
    const key  = `tour_seen_${pathname}`
    const seen = localStorage.getItem(key)
    setShowButton(true)

    // Auto-start tour on first visit to each page
    if (!seen) {
      const timer = setTimeout(() => startTour(false), 800)
      return () => clearTimeout(timer)
    }
  }, [pathname])

  function startTour(manual: boolean = true) {
    const steps = getTourForPath(pathname)
    if (!steps) return

    const driverObj = driver({
      showProgress:     true,
      showButtons:      ["next", "previous", "close"],
      nextBtnText:      "Next →",
      prevBtnText:      "← Back",
      doneBtnText:      "Done ✓",
      progressText:     "{{current}} of {{total}}",
      popoverClass:     "shopsense-tour",
      onDestroyed: () => {
        // Mark tour as seen for this page
        localStorage.setItem(`tour_seen_${pathname}`, "true")
        setTourSeen(true)
      },
      steps,
    })

    driverObj.drive()
  }

  if (!showButton) return null

  return (
    <button
      onClick={() => startTour(true)}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
    >
      ? Tour
    </button>
  )
}