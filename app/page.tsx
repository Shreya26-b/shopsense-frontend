export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">ShopSense</h1>
        <p className="text-gray-500 mb-8">
          AI-Powered E-commerce Analytics
        </p>
        <a
          href="/login"
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
        >
          Get Started
        </a>
      </div>
    </main>
  )
}