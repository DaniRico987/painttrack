export interface Purchase {
  id: number;
  product: string;
  supplier: string;
  date: string;
  quantity: number;
  totalCost: number;
}

export interface PurchaseCardsProps {
  purchases: Purchase[];
  onEdit: (purchase: Purchase) => void;
  onDelete: (purchaseId: number) => void;
}

export interface Props {
  purchases: Purchase[];
}