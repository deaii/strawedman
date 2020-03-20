
export interface Item {
  id: string;
  name: string;
  image: string;
  description: string;

  usablePassages?: (string | number)[];
}