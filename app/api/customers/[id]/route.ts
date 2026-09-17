import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user?.organizationId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 },
      );
    }

    const { id } = await params;

    const customer = await prisma.customer.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 },
      );
    }

    await prisma.customer.delete({
      where: {
        id: customer.id,
      },
    });

    return NextResponse.json({
      message: "Cliente eliminado",
    });
  } catch (error) {
    console.error("Error eliminando cliente:", error);

    return NextResponse.json(
      { error: "No se pudo eliminar el cliente" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user?.organizationId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const body = await request.json();

    const customer = await prisma.customer.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 },
      );
    }

    const updatedCustomer = await prisma.customer.update({
      where: {
        id: customer.id,
      },
      data: {
        name: body.name,
        address: body.address,
        openingTime: body.openingTime ?? null,
        closingTime: body.closingTime ?? null,
        lastPurchaseDate: body.lastPurchaseDate
          ? new Date(body.lastPurchaseDate)
          : null,
      },
    });

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("Error actualizando cliente:", error);

    return NextResponse.json(
      { error: "No se pudo actualizar el cliente" },
      { status: 500 },
    );
  }
}