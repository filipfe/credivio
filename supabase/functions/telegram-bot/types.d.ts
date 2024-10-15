type Profile = {
  id: string;
  first_name: string;
  telegram_id: number;
  settings: {
    language: Locale;
    currency: string;
    telegram_notifications: boolean;
    email_notifications: boolean;
  };
};

type Command = Record<string, string>;

type ProcessReturn = {
  reply: string;
  operations: string[];
};
