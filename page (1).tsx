import OrdersManager from "@/components/admin/OrdersManager";
import { createClient } from "@/lib/supabase/server";
import type { OrderRequest } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminOrders() {
  const { data } = await createClient()
    .from("order_requests")
    .select("*")
    .order("created_at", { ascending: false });
  return <OrdersManager initialRows={(data ?? []) as OrderRequest[]} />;
}
