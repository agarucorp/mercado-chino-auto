/**
 * Tipos de la base, espejo de `supabase/migrations/20260903000000_init_schema.sql`.
 *
 * Escritos a mano para no depender de la CLI. Si el schema cambia, se
 * regeneran con:
 *   supabase gen types typescript --project-id jsnfdeztgefaeshvottd > src/types/database.ts
 */

export type ListingStatus = "pendiente" | "aprobada" | "rechazada" | "archivada";
export type ProviderCategory = "estetico" | "mecanico" | "lubricentro";
export type PlanId = "basico" | "destacado" | "premium";
export type SellerType = "particular" | "concesionario";

export type NewsRow = {
  id: string;
  title: string;
  excerpt: string;
  body: string | null;
  image_url: string | null;
  image_alt: string | null;
  category: string;
  source_name: string | null;
  source_url: string | null;
  marca_id: string | null;
  modelo_id: string | null;
  published: boolean;
  featured: boolean;
  position: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ListingRow = {
  id: string;
  status: ListingStatus;
  plan: PlanId;
  marca_id: string;
  modelo_id: string;
  version: string | null;
  year: number;
  km: number;
  price: number | null;
  price_on_request: boolean;
  currency: "ARS" | "USD";
  fuel: string;
  transmission: string;
  location: string;
  province: string;
  title: string;
  description: string;
  seller_name: string;
  seller_email: string;
  seller_phone: string;
  seller_type: SellerType;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  submitted_at: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  is_weekly_pick?: boolean;
  home_pick_order?: number | null;
  sold?: boolean;
}

export type ListingImageRow = {
  id: string;
  listing_id: string;
  storage_path: string;
  alt: string | null;
  position: number;
  created_at: string;
}

export type ServiceProviderRow = {
  id: string;
  category: ProviderCategory;
  name: string;
  city: string;
  phone: string;
  description: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export type AdminRow = {
  user_id: string;
  email: string;
  created_at: string;
}

export type ReviewRow = {
  id: string;
  marca_id: string;
  modelo_id: string;
  brand: string;
  model: string;
  year: number;
  first_name: string;
  last_name: string;
  author: string;
  rating: number;
  content: string;
  likes: number;
  created_at: string;
  updated_at: string;
}

/**
 * En un INSERT solo son obligatorias las columnas NOT NULL sin default.
 * `Required` lista esas; todo el resto lo completa la base.
 */
type InsertOf<Row, Required extends keyof Row> = Pick<Row, Required> &
  Partial<Omit<Row, Required>>;

export type Database = {
  public: {
    Tables: {
      news: {
        Row: NewsRow;
        Insert: InsertOf<NewsRow, "title">;
        Update: Partial<NewsRow>;
        Relationships: [];
      };
      listings: {
        Row: ListingRow;
        Insert: InsertOf<
          ListingRow,
          | "marca_id"
          | "modelo_id"
          | "year"
          | "km"
          | "fuel"
          | "transmission"
          | "location"
          | "province"
          | "title"
          | "description"
          | "seller_name"
          | "seller_email"
          | "seller_phone"
        >;
        Update: Partial<ListingRow>;
        Relationships: [];
      };
      listing_images: {
        Row: ListingImageRow;
        Insert: InsertOf<ListingImageRow, "listing_id" | "storage_path">;
        Update: Partial<ListingImageRow>;
        Relationships: [];
      };
      admins: {
        Row: AdminRow;
        Insert: InsertOf<AdminRow, "user_id" | "email">;
        Update: Partial<AdminRow>;
        Relationships: [];
      };
      reviews: {
        Row: ReviewRow;
        Insert: InsertOf<
          ReviewRow,
          | "marca_id"
          | "modelo_id"
          | "brand"
          | "model"
          | "year"
          | "first_name"
          | "last_name"
          | "author"
          | "rating"
          | "content"
        >;
        Update: Partial<ReviewRow>;
        Relationships: [];
      };
      service_providers: {
        Row: ServiceProviderRow;
        Insert: InsertOf<ServiceProviderRow, "category" | "name">;
        Update: Partial<ServiceProviderRow>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: {
        Args: Record<string, unknown>;
        Returns: boolean;
      };
    };
    Enums: {
      listing_status: ListingStatus;
      plan_id: PlanId;
      seller_type: SellerType;
    };
    CompositeTypes: { [_ in never]: never };
  };
}
