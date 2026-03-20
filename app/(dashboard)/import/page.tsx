// app/(dashboard)/import/page.tsx
"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

type ImportResult = {
  import:  { imported: number; errors: any[]; type: string }
  reindex: { indexed: number }
  message: string
}

export default function ImportPage() {
  const { data: session }            = useSession()
  const [file,     setFile    ]      = useState<File | null>(null)
  const [type,     setType    ]      = useState<"products" | "orders">("products")
  const [loading,  setLoading ]      = useState(false)
  const [result,   setResult  ]      = useState<ImportResult | null>(null)
  const [error,    setError   ]      = useState("")

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

  return (
    <div className="max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Import Data</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload your store data as CSV — the AI index rebuilds automatically
        </p>
      </div>

      {/* Import type selector */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <h2 className="text-sm font-medium text-gray-700 mb-3">
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
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }
              `}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* CSV format guide */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
        <p className="text-xs font-medium text-gray-500 mb-2">
          Expected {type}.csv format:
        </p>
        {type === "products" ? (
          <code className="text-xs text-gray-700 block">
            name,category,price,stock<br />
            AirPods Pro,Electronics,249.99,120<br />
            Ergonomic Chair,Furniture,399.99,40
          </code>
        ) : (
          <code className="text-xs text-gray-700 block">
            product_name,customer_name,customer_email,quantity,revenue,order_date<br />
            AirPods Pro,Alice Johnson,alice@example.com,2,499.98,2025-10-15<br />
            Ergonomic Chair,Bob Smith,bob@example.com,1,399.99,2025-11-03
          </code>
        )}
      </div>

      {/* File upload */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <h2 className="text-sm font-medium text-gray-700 mb-3">
          Select CSV file
        </h2>

        <input
          type="file"
          accept=".csv"
          suppressHydrationWarning
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800"
        />

        {file && (
          <p className="text-xs text-gray-500 mt-2">
            Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
        )}
      </div>

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-40 transition-colors"
      >
        {loading ? "Uploading and indexing..." : `Import ${type}`}
      </button>

      {/* Error */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Success result */}
      {result && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm font-medium text-green-800 mb-2">
            Import Complete!
          </p>
          <div className="text-sm text-green-700 flex flex-col gap-1">
            <p>Imported: {result.import.imported} {result.import.type}</p>
            <p>AI index rebuilt: {result.reindex.indexed} chunks</p>
            {result.import.errors.length > 0 && (
              <p className="text-amber-600">
                Skipped {result.import.errors.length} rows with errors
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  )
}