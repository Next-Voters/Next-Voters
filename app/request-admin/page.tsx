"use client"

import handleRequestAdmin from '@/server-actions/request-admin'

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-page">
      <div className="bg-red-500 text-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Request Admin Access</h1>
        <button
          className="bg-white text-red-500 px-4 py-2 rounded-md hover:bg-gray-100"
          onClick={async () => await handleRequestAdmin()}
        >
          <span className="font-plus-jakarta-sans">Request</span>
        </button>
      </div>
    </div>
  )
}