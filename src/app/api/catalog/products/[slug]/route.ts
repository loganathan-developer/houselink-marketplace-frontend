const backendUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const response = await fetch(`${backendUrl}/api/products/${encodeURIComponent(slug)}`, { cache: "no-store" });
    return new Response(await response.text(), { status: response.status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ success: false, error: { message: "Product service is unavailable." } }, { status: 502 });
  }
}
