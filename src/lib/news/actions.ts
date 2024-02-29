"use server";

type NewsList = {
  results: News[];
  nextPage?: string;
  error?: string;
};

export async function getNews(page?: string): Promise<NewsList> {
  try {
    const res = await fetch(
      `https://newsdata.io/api/1/news?apikey=${
        process.env.NEWS_DATA_API_KEY
      }&country=pl&category=business&image=1${page ? `&page=${page}` : ""}`
    );
    const data = await res.json();
    return data;
  } catch (err) {
    return {
      results: [],
      error: "Error, try again later",
    };
  }
}
