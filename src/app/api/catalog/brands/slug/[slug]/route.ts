const backendUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const upstream = await fetch(`${backendUrl}/api/brands/slug/${encodeURIComponent(slug)}`, { cache: "no-store", headers: { Accept: "application/json" } });
    return new Response(await upstream.text(), { status: upstream.status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ success: false, error: { message: "Brand service is unavailable." } }, { status: 502 });
  }
}
