import { NextResponse } from "next/server"
import axios from "axios"

// GET /api/jobs/hellowork/page/[page] - Get jobs from hellowork specific page
export async function GET(
  request: Request,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const jobQuery = searchParams.get('job')
    const locationQuery = searchParams.get('location')
    const resultsWanted = searchParams.get('resultsWanted') || '20'
    const { page } = await params

    if (!jobQuery || !locationQuery) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const response = await axios.get(`http://localhost:3001/api/hellowork/page/${page}`, {
      params: {
        jobQuery,
        locationQuery,
        resultsWanted,
      },
    })

    // Le serveur retourne { count, jobs, pagination }, on doit retourner { all: jobs, pagination }
    return NextResponse.json({ 
      all: response.data.jobs || [],
      pagination: response.data.pagination || {}
    })
  } catch (error) {
    console.error("Error fetching HelloWork page:", error)
    return NextResponse.json({ error: "Failed to fetch HelloWork page" }, { status: 500 })
  }
} 