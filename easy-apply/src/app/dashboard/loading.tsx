import React from 'react'

function loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
  )
}

export default loading
