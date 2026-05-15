import { getCredentialManifest } from "@/lib/api/waltid";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ type: string }> }) {
    const { type } = await params;
    console.log("Fetching manifest for type:", type);
    try {
        const manifest = await getCredentialManifest(type);
        return NextResponse.json(manifest.claims);
    } catch (error) {
        console.error("Error fetching manifest:", error);
        return NextResponse.json({ error: "Failed to fetch manifest" }, { status: 500 });
    }
}