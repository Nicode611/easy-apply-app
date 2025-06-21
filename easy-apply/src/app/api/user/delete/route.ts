import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Delete all related data first
    await prisma.$transaction([
      // Delete user's jobs
      prisma.job.deleteMany({
        where: {
          userId: session.user.id,
        },
      }),
      // Delete user's sessions
      prisma.session.deleteMany({
        where: {
          userId: session.user.id,
        },
      }),
      // Delete user's accounts (OAuth)
      prisma.account.deleteMany({
        where: {
          userId: session.user.id,
        },
      }),
      // Finally delete the user
      prisma.user.delete({
        where: {
          id: session.user.id,
        },
      }),
    ]);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[USER_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 