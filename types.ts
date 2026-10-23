export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
};

export type EventStatus = "open" | "upcoming" | "closed";

export type JastipEvent = {
  id: string;
  name: string;
  slug: string;
  location: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  image_url: string | null;
  status: EventStatus;
  is_featured: boolean;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  slug: string;
  category_id: string | null;
  event_id: string | null;
  reference_price: number;
  description: string | null;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  categories?: Pick<Category, "name" | "slug"> | null;
  events?: Pick<JastipEvent, "name" | "slug"> | null;
};

export type Testimonial = {
  id: string;
  customer_name: string;
  content: string;
  rating: number;
  is_published: boolean;
  created_at: string;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_href: string | null;
  sort_order: number;
  is_active: boolean;
};

export type OrderStatus =
  | "new"
  | "contacted"
  | "purchasing"
  | "shipped"
  | "done"
  | "cancelled";

export type OrderRequest = {
  id: string;
  customer_name: string;
  event_name: string;
  product_name: string;
  brand: string | null;
  variant: string | null;
  quantity: number;
  budget: number | null;
  notes: string | null;
  status: OrderStatus;
  created_at: string;
};

export const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "new", label: "Baru" },
  { value: "contacted", label: "Dihubungi" },
  { value: "purchasing", label: "Sedang dibeli" },
  { value: "shipped", label: "Dikirim" },
  { value: "done", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

export const EVENT_STATUSES: { value: EventStatus; label: string }[] = [
  { value: "open", label: "Open Order" },
  { value: "upcoming", label: "Segera Hadir" },
  { value: "closed", label: "Ditutup" },
];
