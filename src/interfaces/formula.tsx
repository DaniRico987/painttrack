export interface Formula {
  id: number;
  name: string;
  description: string;
  mixType: string;
  totalAmount: number;
  dryingTime: number;
  coverage: number;
  ingredients: Array<{
    id: number;
    name: string;
    quantity: number;
    unit: string;
  }>;
}
