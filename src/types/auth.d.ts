import { User } from "@supabase/supabase-js";

type Account = User & {
  first_name: string;
  last_name: string;
};
