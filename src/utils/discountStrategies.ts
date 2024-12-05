// discountStrategies.ts
interface DiscountLogic {
  id: string;
  description: string;
  calculateDiscount: (cartTotal: number) => number; // Returns discount amount
}

const discountStrategies: DiscountLogic[] = [
  {
    id: "FLAT_50",
    description: "Flat ₹50 off on orders above ₹500",
    calculateDiscount: (cartTotal) => (cartTotal > 500 ? 50 : 0),
  },
  {
    id: "PERCENT_10",
    description: "10% off on orders above ₹1000",
    calculateDiscount: (cartTotal) => (cartTotal > 1000 ? cartTotal * 0.1 : 0),
  },
  {
    id: "FREE_SHIPPING",
    description: "Free shipping on orders above ₹1500",
    calculateDiscount: (cartTotal) => (cartTotal > 1500 ? 100 : 0), // Assuming ₹100 is the shipping fee
  },
];

export const getDiscountById = (id: string) => {
  return discountStrategies.find((strategy) => strategy.id === id);
};

export default discountStrategies;
