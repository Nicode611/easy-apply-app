import { NextResponse } from "next/server"
import axios from "axios"

// GET /api/jobs/external - Get jobs from external API
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const jobQuery = searchParams.get('job')
    const locationQuery = searchParams.get('location')
    const resultsWanted = searchParams.get('resultsWanted') || '30'

    if (!jobQuery || !locationQuery) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const response = await axios.get('http://localhost:3001/api/all', {
      params: {
        jobQuery,
        locationQuery,
        resultsWanted,
      },
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error fetching external jobs:", error)
    return NextResponse.json({ error: "Failed to fetch external jobs" }, { status: 500 })
  }
} 