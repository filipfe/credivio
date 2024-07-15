type Language = {
  code: string;
  name: string;
};

type Preferences = {
  currency: string;
  language: Language;
};

type Account = {
  first_name: string;
  last_name: string;
  email: string;
  language_code: string;
};
