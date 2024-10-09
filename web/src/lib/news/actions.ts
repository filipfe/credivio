"use server";

import axios from "axios";

type NewsList = {
  articles: News[];
  error?: string;
};

export async function getNews(
  language_code: string,
  page: number,
): Promise<NewsList> {
  const [language, country] = language_code.split("-");
  try {
    const { data } = await axios.post(
      `https://news.opera-api.com/${country.toLowerCase()}/${language}/v1/news/category/business`,
      {
        page,
      },
    );
    return data;
  } catch (err) {
    return {
      articles: [],
      error: "Error, try again later",
    };
  }
}
