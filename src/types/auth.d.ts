type Account = User & {
  first_name: string;
  last_name: string;
};

type Service = {
  id: string;
  name: string;
  href: string;
  title: string;
  description: string;
  price: number;
  created_at?: string;
};
