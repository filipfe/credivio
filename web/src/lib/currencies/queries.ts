import axios from "axios";

export async function getExchangeRate(
  from: string,
  to: string,
): Promise<number> {
  const { data } = await axios.get(
    `https://api.api-ninjas.com/v1/exchangerate?pair=${from}_${to}`,
    {
      headers: {
        "X-Api-Key": process.env.NEXT_PUBLIC_NINJAS_API_KEY,
      },
    },
  );
  return data.exchange_rate;
}
