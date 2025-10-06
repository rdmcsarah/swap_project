// import { PrismaClient } from '@/generated/prisma';
// import { NextResponse } from 'next/server';

// const prisma = new PrismaClient();

// export async function GET(request: Request) {
//   try {
//     const url = new URL(request.url);
//     const employeeId = url.searchParams.get('employeeId');
//     if (!employeeId) return NextResponse.json([], { status: 200 });

//     const notifications = await prisma.notification.findMany({
//       where: { recipientEmployeeId: employeeId },
//       orderBy: { createdAt: 'desc' },
//       include: { request: true },
//     });

//     return NextResponse.json(notifications);
//   } catch (err) {
//     console.error('Error fetching notifications', err);
//     return NextResponse.json({ error: 'Failed' }, { status: 500 });
//   }
// }

// export async function PUT(request: Request) {
//   try {
//     const body = await request.json();
//     const { id, markAll, employeeId } = body as { id?: string; markAll?: boolean; employeeId?: string };

//     if (markAll && employeeId) {
//       await prisma.notification.updateMany({ where: { recipientEmployeeId: employeeId, read: false }, data: { read: true } });
//       return NextResponse.json({ ok: true });
//     }

//     if (id) {
//       await prisma.notification.update({ where: { id }, data: { read: true } });
//       return NextResponse.json({ ok: true });
//     }

//     return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
//   } catch (err) {
//     console.error('Error updating notification', err);
//     return NextResponse.json({ error: 'Failed' }, { status: 500 });
//   }
// }
