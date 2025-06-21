import { NextResponse } from "next/server"
import axios from "axios"

// GET /api/jobs/hellowork/info - Get pagination info from hellowork
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const jobQuery = searchParams.get('job')
    const locationQuery = searchParams.get('location')

    if (!jobQuery || !locationQuery) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const response = await axios.get('http://localhost:3001/api/hellowork/info', {
      params: {
        jobQuery,
        locationQuery,
      },
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error fetching HelloWork pagination info:", error)
    return NextResponse.json({ error: "Failed to fetch HelloWork pagination info" }, { status: 500 })
  }
} 