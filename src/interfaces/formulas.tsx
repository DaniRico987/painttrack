interface Formula {
  id: number;
  name: string;
  description: string;
  ingredients: Ingredient[];
  mixType: "base" | "finish" | "special";
  totalAmount: number;
  dryingTime: number;
  coverage: number;
}

interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: "kg" | "g" | "ml" | "L" | "unidades";
}
