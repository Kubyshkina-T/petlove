
export type News = {
  _id: string;
  imgUrl: string;
  title: string;
  text: string;
  date: string;
  url: string;
  id: string;
};

export type NewsResponse = {
  page: number;
  perPage: number;
  totalPages: number;
  results: News[];
};
