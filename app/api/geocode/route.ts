import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { address } = await request.json();

    if (!address || typeof address !== "string") {
      return NextResponse.json(
        { error: "La dirección es obligatoria" },
        { status: 400 }
      );
    }

    const url = new URL("https://nominatim.openstreetmap.org/search");

    url.searchParams.set("q", address);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("limit", "1");
    url.searchParams.set("countrycodes", "ar");

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "RoutePlanner/1.0 (desarrollo)",
        "Accept-Language": "es",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Nominatim error:", response.status, errorText);

      return NextResponse.json(
        { error: "El servicio de geocoding rechazó la solicitud" },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.length === 0) {
      return NextResponse.json(
        { error: "No se encontró la dirección" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      latitude: Number(data[0].lat),
      longitude: Number(data[0].lon),
      displayName: data[0].display_name,
    });
  } catch (error) {
    console.error("Geocoding error:", error);

    return NextResponse.json(
      { error: "Ocurrió un error al buscar la dirección" },
      { status: 500 }
    );
  }
}