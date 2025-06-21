import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les notes d'un job
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const jobId = decodeURIComponent(id);
    
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        user: {
          email: session.user.email
        }
      },
      select: {
        notes: true
      }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ notes: job.notes });
  } catch (error) {
    console.error('Error fetching job notes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des notes' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour les notes d'un job
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const jobId = decodeURIComponent(id);
    const { notes } = await request.json();

    if (typeof notes !== 'string') {
      return NextResponse.json(
        { error: 'Le champ notes doit être une chaîne de caractères' },
        { status: 400 }
      );
    }

    const updatedJob = await prisma.job.updateMany({
      where: {
        id: jobId,
        user: {
          email: session.user.email
        }
      },
      data: {
        notes: notes.trim() || null
      }
    });

    if (updatedJob.count === 0) {
      return NextResponse.json({ error: 'Job non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Notes mises à jour avec succès',
      notes: notes.trim() || null
    });
  } catch (error) {
    console.error('Error updating job notes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des notes' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer les notes d'un job
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const jobId = decodeURIComponent(id);

    const updatedJob = await prisma.job.updateMany({
      where: {
        id: jobId,
        user: {
          email: session.user.email
        }
      },
      data: {
        notes: null
      }
    });

    if (updatedJob.count === 0) {
      return NextResponse.json({ error: 'Job non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Notes supprimées avec succès'
    });
  } catch (error) {
    console.error('Error deleting job notes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression des notes' },
      { status: 500 }
    );
  }
} 