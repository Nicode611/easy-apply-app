import { NextResponse } from "next/server"
import axios from "axios"


// GET /api/jobs/welcometothejungle - Get jobs from welcometothejungle
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const jobQuery = searchParams.get('job')
    const locationQuery = searchParams.get('location')
    const resultsWanted = searchParams.get('resultsWanted') || '30'

    if (!jobQuery || !locationQuery) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const response = await axios.get('http://localhost:3001/api/wttj', {
      params: {
        jobQuery,
        locationQuery,
        resultsWanted,
      },
    })

    // Le serveur retourne { count, jobs }, on doit retourner { all: jobs }
    return NextResponse.json({ all: response.data.jobs || [] })
  } catch (error) {
    console.error("Error fetching external jobs:", error)
    return NextResponse.json({ error: "Failed to fetch external jobs" }, { status: 500 })
  }
}