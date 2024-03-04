// import { createClient } from "@/utils/supabase/server";

// const supabase = createClient();

// function formatDate(date: Date) {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");

//   return `${day}-${month}-${year}`;
// }

// const today = new Date();
// const formattedDate = formatDate(today);
// let i = 1;
// const generateRandomRow = () => {
//   const issuedAt = formattedDate;
//   const title = `Sample Title ${Math.floor(Math.random() * 1000)}`;
//   const amount = (Math.random() * 1000).toFixed(2);
//   const description = "Sample Description";
//   const currency = ["USD", "EUR", "GBP"][Math.floor(Math.random() * 3)];
//   const currencyDate = formattedDate;
//   const budgetAfter = (Math.random() * 5000).toFixed(2);

//   return {
//     issued_at: issuedAt,
//     title: title,
//     amount: amount,
//     description: description,
//     currency: currency,
//     currency_date: currencyDate,
//     budget_after: budgetAfter,
//   };
// };

// const supabase = createClient();

// const rows = new Array(10).fill(null).map(() => generateRandomRow());

// const { error } = await supabase.from("incomes").insert(rows);
