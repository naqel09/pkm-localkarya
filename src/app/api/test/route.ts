import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        return NextResponse.json({ 
            message: "API test berhasil",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Test gagal", details: error },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        return NextResponse.json({ 
            message: "POST test berhasil",
            receivedData: body,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return NextResponse.json(
            { error: "POST test gagal", details: error },
            { status: 500 }
        );
    }
}
