"use server";

import axios from "axios";

type NewsList = {
  results: News[];
  nextPage?: string;
  error?: string;
};

export async function getNews(page?: number): Promise<NewsList> {
  try {
    const { data } = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${process.env.NEWS_DATA_API_KEY}&country=pl&category=business`
    );
    return data;
  } catch (err) {
    return {
      results: [],
      error: "Error, try again later",
    };
  }
}
