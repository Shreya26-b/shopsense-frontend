// app/(dashboard)/import/page.tsx
"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

type ImportResult = {
  import:  { imported: number; errors: any[]; type: string }
  reindex: { indexed: number }
  message: string
}

type RebuildResult = {
  indexed:  number
  products: number
  orders:   number
  message:  string
}

export default function ImportPage() {
  const { data: session }        = useSession()
  const [file,          setFile         ] = useState<File | null>(null)
  const [type,          setType         ] = useState<"products" | "orders">("products")
  const [loading,       setLoading      ] = useState(false)
  const [result,        setResult       ] = useState<ImportResult | null>(null)
  const [error,         setError        ] = useState("")
  const [rebuilding,    setRebuilding   ] = useState(false)
  const [rebuildResult, setRebuildResult] = useState<RebuildResult | null>(null)
  const [rebuildError,  setRebuildError ] = useState("")

  async function handleUpload() {
    if (!file || !session?.user?.accessToken) return

    setLoading(true)
    setError("")
    setResult(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/import/csv?type=${type}`,
        {
          method:  "POST",
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
          body: formData,
        }
      )

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Import failed")
      }

      const data = await res.json()
      setResult(data)

    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handleRebuildIndex() {
    if (!session?.user?.accessToken) return

    setRebuilding(true)
    setRebuildResult(null)
    setRebuildError("")

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/index/build`,
        {
          method:  "POST",
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      )

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Rebuild failed")
      }

      const data = await res.json()
      setRebuildResult(data)

    } catch (err: any) {
      setRebuildError(err.message || "Something went wrong")
    } finally {
      setRebuilding(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">

      {/* Header */}
      <div id="tour-import-header" className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Import Data
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Upload your store data as CSV — the AI index rebuilds automatically
        </p>
      </div>

      {/* Rebuild AI Index */}
      <div id="tour-rebuild-index" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-4">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Rebuild AI Index
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Run this after every server restart or if the chatbot seems outdated.
        </p>
        <button
          onClick={handleRebuildIndex}
          disabled={rebuilding}
          className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-40 transition-colors"
        >
          {rebuilding ? "Rebuilding..." : "Rebuild Index"}
        </button>

        {rebuildResult && (
          <div className="mt-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <p className="text-xs font-medium text-green-800 dark:text-green-300 mb-1">
              Index rebuilt successfully!
            </p>
            <p className="text-xs text-green-700 dark:text-green-400">
              {rebuildResult.indexed} chunks indexed
              ({rebuildResult.products} products,
               {rebuildResult.orders} orders)
            </p>
          </div>
        )}

        {rebuildError && (
          <div className="mt-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-xs text-red-600 dark:text-red-400">{rebuildError}</p>
          </div>
        )}
      </div>

      {/* Import type selector */}
      <div id="tour-import-type" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-4">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          What are you importing?
        </h2>
        <div className="flex gap-3">
          {(["products", "orders"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`
                flex-1 py-3 rounded-xl border text-sm font-medium capitalize
                transition-colors
                ${type === t
                  ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }
              `}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* CSV format guide */}
      <div id="tour-csv-format" className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
          Expected {type}.csv format:
        </p>
        {type === "products" ? (
          <code className="text-xs text-gray-700 dark:text-gray-300 block">
            name,category,price,stock<br />
            AirPods Pro,Electronics,249.99,120<br />
            Ergonomic Chair,Furniture,399.99,40
          </code>
        ) : (
          <code className="text-xs text-gray-700 dark:text-gray-300 block">
            product_name,customer_name,customer_email,quantity,revenue,order_date<br />
            AirPods Pro,Alice Johnson,alice@example.com,2,499.98,2025-10-15<br />
            Ergonomic Chair,Bob Smith,bob@example.com,1,399.99,2025-11-03
          </code>
        )}
      </div>

      {/* File upload */}
      <div id="tour-file-upload" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-4">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Select CSV file
        </h2>

        <input
          type="file"
          accept=".csv"
          suppressHydrationWarning
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800 dark:file:bg-white dark:file:text-black dark:hover:file:bg-gray-200"
        />

        {file && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
        )}
      </div>

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-40 transition-colors"
      >
        {loading ? "Uploading and indexing..." : `Import ${type}`}
      </button>

      {/* Error */}
      {error && (
        <div className="mt-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Success result */}
      {result && (
        <div className="mt-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
            Import Complete!
          </p>
          <div className="text-sm text-green-700 dark:text-green-400 flex flex-col gap-1">
            <p>Imported: {result.import.imported} {result.import.type}</p>
            <p>AI index rebuilt: {result.reindex.indexed} chunks</p>
            {result.import.errors.length > 0 && (
              <p className="text-amber-600 dark:text-amber-400">
                Skipped {result.import.errors.length} rows with errors
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  )
}