type Service = {
  id: string;
  name: string;
  href: string;
  title: string;
  description: string;
  price: number;
  created_at?: string;
  is_active: boolean;
};

type Settings = {
  telegram_id: string;
  graph_time: string;
  email_notifications: boolean;
  telegram_notifications: boolean;
};
