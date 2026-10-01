import { proxyCategoryRequest } from "@/lib/category-proxy";

export const dynamic = "force-dynamic";

export async function GET() {
  return proxyCategoryRequest("/tree");
}
