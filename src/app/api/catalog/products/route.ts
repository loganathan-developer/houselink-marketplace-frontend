const backendUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const query = new URL(request.url).search;
    const response = await fetch(`${backendUrl}/api/products${query}`, { cache: "no-store", headers: { Accept: "application/json" } });
    return new Response(await response.text(), { status: response.status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ success: false, error: { message: "Product service is unavailable." } }, { status: 502 });
  }
}
