type Profile = {
  id: string;
  first_name: string;
  language_code: string;
  currency: string;
  telegram_id: number;
  settings: {
    graph_time: string;
    telegram_notifications: boolean;
    email_notifications: boolean;
  };
};

type Command = Record<string, string>;

type ProcessReturn = {
  reply: string;
  operations: string[];
};
