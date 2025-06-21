import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// GET /api/jobs - Get all jobs for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get all jobs for the current user
    const jobs = await prisma.job.findMany({
      where: { 
        userId: user.id
      }
    })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST /api/jobs - Save a new job
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is logged in
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    // Check if user exists
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get the body of the request
    const body = await request.json()
    const { url, image, title, location, companyLogo, companyName, jobWebsite, jobPostDate, appliedState, appliedDate, savedState, savedDate, notes } = body

    // Validate required fields
    if (!url || !title || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if job already exists for this user
    const existingJob = await prisma.job.findFirst({
      where: {
        url,
        userId: user.id
      }
    })

    if (existingJob) {
      return NextResponse.json({ 
        error: "Job already exists"
      }, { status: 400 })
    }

    const job = await prisma.job.create({
      data: {
        id: url, // Use URL as the ID
        url, // Also store URL as a separate field
        userId: user.id,
        image: image || "",
        title,
        location,
        companyLogo: companyLogo || "", 
        companyName,
        jobWebsite,
        jobPostDate,
        appliedState,
        appliedDate,
        savedState,
        savedDate,
        notes: notes || null,
      }
    })

    return NextResponse.json(job)
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// DELETE /api/jobs/[id] - Update job state or delete if both states are null
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get the job ID from the URL
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 })
    }

    // Get the current job state
    const job = await prisma.job.findUnique({
      where: {
        id,
        userId: user.id
      }
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // If job has appliedState, just update savedState
    if (job.appliedState) {
      const updatedJob = await prisma.job.update({
        where: {
          id,
          userId: user.id
        },
        data: {
          savedState: "Not Saved",
          savedDate: new Date()
        }
      })
      return NextResponse.json(updatedJob)
    }

    // If no appliedState, delete the job
    await prisma.job.delete({
      where: {
        id,
        userId: user.id
      }
    })

    return NextResponse.json({ message: "Job deleted successfully" })
  } catch (error) {
    console.error("Error updating/deleting job:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
} 