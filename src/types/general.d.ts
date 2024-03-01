type Page = {
  title: string;
  href: string;
  icon: LucideIcon;
};

type SettingsPage = Page & {
  description: string;
};

type SupabaseResponse<T> = {
  error?: string;
  results: T[];
};
