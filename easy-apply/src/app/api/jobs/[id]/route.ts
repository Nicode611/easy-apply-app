import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// PATCH /api/jobs/[id] - Update a job's status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams
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

    // Find the job
    const job = await prisma.job.findUnique({
      where: { id }
    })

    // Check if job exists
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Check if job belongs to user
    if (job.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the body of the request
    const body = await request.json()

    let updatedJob: { id: string; appliedState?: string | null; savedState?: string | null } | null = null

    // Check if the action is save
    if (body.action === 'save') {
      // Update the job
      updatedJob = await prisma.job.update({
        where: { id },
        data: {
          savedState: "Saved",
          savedDate: new Date().toISOString()
        }
      })
    }

    // Check if the action is "unsave"
    if (body.action === 'unsave') {
      // Update the job
      updatedJob = await prisma.job.update({
        where: { id },
        data: {
          savedState: "Not Saved",
          savedDate: undefined
        }
      })
    }

    // Check if the action is "apply"
    if (body.action === 'apply') {
      // Update the job
      updatedJob = await prisma.job.update({
        where: { id },
        data: {
          appliedState: "Applied",
          appliedDate: new Date().toISOString()
        }
      })
    }

    // Check if the action is "unapply" 
    if (body.action === 'unapply') {
      // Update the job
      updatedJob = await prisma.job.update({
        where: { id },
        data: {
          appliedState: "Not Applied",
          appliedDate: undefined
        }
      })
    }

    // Check if both states are "Not Saved" or "Not Applied", delete the job
    if (updatedJob && 
        (updatedJob.appliedState === "Not Applied" || !updatedJob.appliedState) && 
        (updatedJob.savedState === "Not Saved" || !updatedJob.savedState)) {
      await prisma.job.delete({
        where: { id }
      })
      return NextResponse.json({ message: "Job deleted successfully" })
    }

    return NextResponse.json(updatedJob)
  } catch (error) {
    console.error("Error updating job:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// DELETE /api/jobs/[id] - Delete a job
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams
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

    // Find the job
    const job = await prisma.job.findUnique({
      where: {
        id,
        userId: user.id
      }
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Check if job belongs to user
    if (job.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete the job
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