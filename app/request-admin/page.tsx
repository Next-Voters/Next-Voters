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
    <div className="flex flex-col items-center justify-center min-h-screen bg-page px-5">
      <div className="bg-white border border-gray-200 rounded-2xl p-7 sm:p-9 shadow-sm w-full max-w-[420px]">
        <h1 className="text-[22px] font-bold text-gray-950 mb-1.5 tracking-tight">
          Request Admin Access
        </h1>
        <p className="text-[14px] text-gray-500 mb-7">
          Submit your details to request admin access.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-[13px] font-semibold text-gray-700 mb-1.5">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14.5px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/60 transition-all bg-gray-50/50 placeholder:text-gray-400"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-[13px] font-semibold text-gray-700 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[14.5px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/60 transition-all bg-gray-50/50 placeholder:text-gray-400"
              placeholder="you@example.com"
            />
          </div>
          {message && (
            <p className={`text-[13px] rounded-lg px-3 py-2 ${message.startsWith("User added") ? "text-green-700 bg-green-50 border border-green-200" : "text-gray-600 bg-gray-50 border border-gray-200"}`}>
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-white px-4 py-3 rounded-xl text-[15px] font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50"
          >
            {loading ? "Submitting…" : "Request Access"}
          </button>
        </form>
      </div>
    </div>
  )
}