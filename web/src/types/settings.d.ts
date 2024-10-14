type Language = {
  code: Locale;
  name: string;
};

type Preferences = {
  currency: string;
  language: Language;
  telegram_id: number;
  telegram_token: string;
};

type Account = {
  first_name: string;
  last_name: string;
  email: string;
  language_code: string;
};
