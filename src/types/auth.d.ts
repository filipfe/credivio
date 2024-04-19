import { User } from "@supabase/supabase-js";

export type Account = User & {
  first_name: string;
  last_name: string;
};

export type Service = {
  id: string;
  name: string;
  href: string;
  title: string;
  description: string;
  price: number;
  created_at?: string;
};
