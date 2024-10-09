// type News = {
//   article_id: string;
//   title: string;
//   link: string;
//   creator: string[];
//   description: string;
//   content: string;
//   pubDate: string;
//   image_url: string;
//   source_id: string;
//   source_url: string;
//   source_icon: string;
//   language: string;
// };
type News = {
  title: string;
  timestamp: number;
  has_copyright: boolean;
  thumbnail: string[];
  summary: string;
  source: string;
  source_name: string;
  original_url: string;
  logo: string;
  news_id: string;
};
