"use client"

import { useState } from "react"
import handleRequestAdmin from "@/server-actions/request-admin"

export default function Page() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setLoading(true)
    try {
      const result = await handleRequestAdmin(email, name)
      setMessage(result)
    } catch {
      setMessage("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-page px-4">
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 font-plus-jakarta-sans">
          Request Admin Access
        </h1>
        <p className="text-gray-600 text-sm mb-6 font-plus-jakarta-sans">
          Submit your details to request admin access.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 font-plus-jakarta-sans">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-plus-jakarta-sans"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 font-plus-jakarta-sans">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-plus-jakarta-sans"
              placeholder="you@example.com"
            />
          </div>
          {message && (
            <p className={`text-sm font-plus-jakarta-sans ${message.startsWith("User added") ? "text-green-600" : "text-gray-600"}`}>
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors font-plus-jakarta-sans font-medium disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Request"}
          </button>
        </form>
      </div>
    </div>
  )
}