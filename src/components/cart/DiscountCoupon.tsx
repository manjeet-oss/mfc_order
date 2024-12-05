"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DiscountCouponProps {
  cart: Record<number, { id: number; quantity: number }>;
  menu: Record<number, { price: number }>;
  applyDiscount: (discountedTotal: number) => void;
}

const DiscountCoupon: React.FC<DiscountCouponProps> = ({ cart, menu, applyDiscount }) => {
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleApplyCoupon = () => {
    const validCoupons: Record<string, number> = {
      SAVE10: 0.1, // 10% discount
      SAVE20: 0.2, // 20% discount
    };

    const total = Object.entries(cart).reduce(
      (sum, [itemId, cartItem]) => sum + cartItem.quantity * (menu[+itemId]?.price || 0),
      0
    );

    if (validCoupons[couponCode.toUpperCase()]) {
      const discount = validCoupons[couponCode.toUpperCase()];
      const discountedTotal = total - total * discount;
      applyDiscount(discountedTotal);
      setSuccessMessage(`Coupon applied! You saved ${(total * discount).toFixed(2)}.`);
      setError("");
    } else {
      setError("Invalid coupon code. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-bold text-lg">Apply Coupon</h3>
      <div className="flex gap-2">
        <Input 
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <Button
          variant="order"
          onClick={handleApplyCoupon}
        >
          Apply
        </Button>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}
    </div>
  );
};

export default DiscountCoupon;
