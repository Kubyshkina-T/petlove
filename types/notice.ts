
export type Notice = {
  _id: string;
  species: string;
  category: string;
  price?: number;
  title: string;
  name: string;
  birthday: string;
  comment: string;
  sex: string;
  location: string;
  imgURL: string;
  createdAt: string;
  updatedAt?: string;
  user: string;
  popularity: number;
};

export type NoticesResponse = {
  page: number;
  perPage: number;
  totalPages: number;
  results: Notice[];
};
