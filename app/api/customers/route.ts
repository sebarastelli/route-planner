import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.organizationId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 },
      );
    }

    const body = await request.json();

    if (
      !body.name ||
      !body.address ||
      body.latitude === undefined ||
      body.longitude === undefined
    ) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios del cliente" },
        { status: 400 },
      );
    }

    const customer = await prisma.customer.create({
      data: {
        name: body.name,
        address: body.address,
        latitude: body.latitude,
        longitude: body.longitude,
        openingTime: body.openingTime ?? null,
        closingTime: body.closingTime ?? null,
        lastPurchaseDate: body.lastPurchaseDate
          ? new Date(body.lastPurchaseDate)
          : null,

        organization: {
          connect: {
            id: session.user.organizationId,
          },
        },
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("Error creando cliente:", error);

    return NextResponse.json(
      { error: "No se pudo crear el cliente" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.organizationId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 },
      );
    }

    const customers = await prisma.customer.findMany({
      where: {
        organizationId: session.user.organizationId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error obteniendo clientes:", error);

    return NextResponse.json(
      { error: "No se pudieron obtener los clientes" },
      { status: 500 },
    );
  }
}