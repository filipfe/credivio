"use server";

import axios from "axios";

type NewsList = {
  results: News[];
  nextPage?: string;
  error?: string;
};

export async function getNews(page?: number): Promise<NewsList> {
  try {
    const res = await axios.get(
      "https://news67.p.rapidapi.com/v2/country-news",
      {
        params: {
          fromCountry: "pl",
          onlyInternational: "true",
        },
        headers: {
          "X-RapidAPI-Key":
            "2f99988b69msh28827447769c408p19a129jsn3a95926dfd21",
          "X-RapidAPI-Host": "news67.p.rapidapi.com",
        },
      }
    );
    return res.data;
  } catch (err) {
    return {
      results: [],
      error: "Error, try again later",
    };
  }
}
