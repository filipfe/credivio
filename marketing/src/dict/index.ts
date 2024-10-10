import "server-only";

const dictionaries = {
  pl: () => import("./pl.json").then((module) => module.default),
  en: () => import("./en.json").then((module) => module.default),
};

const getDictionary = async (locale: Locale) => dictionaries[locale]();

export type Dict = Awaited<ReturnType<typeof getDictionary>>;

export const langs = Object.keys(dictionaries);

export default getDictionary;
