import { NextResponse } from "next/server"
import axios from "axios"


// GET /api/jobs/indeed - Get jobs from indeed
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const jobQuery = searchParams.get('job')
    const locationQuery = searchParams.get('location')
    const resultsWanted = searchParams.get('resultsWanted') || '50'

    if (!jobQuery || !locationQuery) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const response = await axios.get('http://localhost:3001/api/indeed', {
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