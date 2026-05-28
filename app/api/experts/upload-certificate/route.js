import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
const MAX_CERT_FILE_BYTES = 10 * 1024 * 1024;

function apiUrl(endpoint) {
  return `${API_BASE}/${String(endpoint).replace(/^\/+/, "")}`;
}

/** Proxy certificate upload to S3 so the browser never PUTs to AWS (avoids S3 CORS). */
export async function POST(request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "Invalid upload payload" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ message: "Certificate file is required" }, { status: 400 });
  }

  const name = file.name || "certificate.pdf";
  const type = file.type || "application/pdf";
  const size = file.size || 0;

  const isPdf =
    type === "application/pdf" || name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    return NextResponse.json({ message: "Upload a PDF certificate" }, { status: 400 });
  }
  if (size > MAX_CERT_FILE_BYTES) {
    return NextResponse.json(
      { message: "Certificate must be 10 MB or smaller" },
      { status: 400 },
    );
  }

  try {
    const presignResponse = await fetch(apiUrl("experts/uploads/presign"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify({
        files: [
          {
            name,
            type,
            size,
            category: "certificate",
          },
        ],
      }),
    });

    const presign = await presignResponse.json().catch(() => ({}));
    if (!presignResponse.ok) {
      return NextResponse.json(
        { message: presign?.message || presign?.error || "Could not prepare upload" },
        { status: presignResponse.status || 502 },
      );
    }

    const upload = presign?.uploads?.[0];
    if (!upload?.uploadUrl) {
      return NextResponse.json(
        { message: "Could not prepare certificate upload" },
        { status: 502 },
      );
    }

    const fileBuffer = await file.arrayBuffer();
    const s3Response = await fetch(upload.uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": type,
      },
      body: fileBuffer,
    });

    if (!s3Response.ok) {
      return NextResponse.json(
        { message: "Certificate upload failed. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ upload });
  } catch (error) {
    console.error("upload-certificate proxy failed:", error);
    return NextResponse.json(
      { message: "Certificate upload failed. Please try again." },
      { status: 500 },
    );
  }
}
