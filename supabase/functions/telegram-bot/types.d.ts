type Profile = {
  id: string;
  first_name: string;
  telegram_id: number;
  settings: {
    language: string;
    currency: string;
    telegram_notifications: boolean;
    email_notifications: boolean;
    timezone: string;
  };
};

type Command = Record<string, string>;

type ProcessReturn = {
  reply: string;
  operations: string[];
};
