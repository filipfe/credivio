import pl from "./pl.ts";

const locales = {
  pl,
};

const getLocale = (locale: keyof typeof locales) => locales[locale];

export type Dict = ReturnType<typeof getLocale>;

export default locales;
