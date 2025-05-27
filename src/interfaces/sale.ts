export interface Sale {
  id: number;
  client: string;
  product: string;
  date: string; // formato YYYY-MM-DD
  quantity: number;
  totalPrice: number;
}

export interface SaleCardsProps {
  sales: Sale[];
  onEdit: (sale: Sale) => void;
  onDelete: (id: number) => void;
}