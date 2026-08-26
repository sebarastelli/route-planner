import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await prisma.customer.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: "Cliente eliminado" });
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
    const { id } = await params;
    const body = await request.json();

    const customer = await prisma.customer.update({
      where: {
        id,
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

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error actualizando cliente:", error);

    return NextResponse.json(
      { error: "No se pudo actualizar el cliente" },
      { status: 500 },
    );
  }
}