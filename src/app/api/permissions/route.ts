import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const permissions = await prisma.permission.findMany({
      include: { roles: true },
    });
    return NextResponse.json(permissions);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json({ error: 'Failed to fetch permissions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, route, parentId } = await request.json();
    const permission = await prisma.permission.create({
      data: {
        name,
        route,
        parentId,
      },
    });
    return NextResponse.json(permission);
  } catch (error) {
    console.error('Error creating permission:', error);
    return NextResponse.json({ error: 'Failed to create permission' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, route, parentId } = await request.json();
    const permission = await prisma.permission.update({
      where: { id },
      data: {
        name,
        route,
        parentId,
      },
    });
    return NextResponse.json(permission);
  } catch (error) {
    console.error('Error updating permission:', error);
    return NextResponse.json({ error: 'Failed to update permission' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.permission.delete({ where: { id } });
    return NextResponse.json({ message: 'Permission deleted successfully' });
  } catch (error) {
    console.error('Error deleting permission:', error);
    return NextResponse.json({ error: 'Failed to delete permission' }, { status: 500 });
  }
}
