import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface CartItem {
  id: number;
  quantity: number;
}

interface CartFooterProps {
  cart: Record<number, CartItem>;
}

export default function CartFooter({ cart }: CartFooterProps) {
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Calculate total items from the cart prop
    const itemCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    setTotalItems(itemCount);
  }, [cart]);

  useEffect(() => {
    // Check local storage for cart data on component mount
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const parsedCart: Record<number, CartItem> = JSON.parse(storedCart);
        const itemCount = Object.values(parsedCart).reduce((sum, item) => sum + item.quantity, 0);
        setTotalItems(itemCount);
      }
    }
  }, []);

  if (totalItems === 0) {
    return null;
  }

  const handleOrderClick = () => {
    router.push("/cart");
  };

  return (
    <div className="fixed bottom-4 rounded-[10px] left-0 right-0 bg-white w-[90%] max-w-md shadow-lg p-4 flex justify-between items-center transition-transform transform translate-y-0 mx-auto">
      <span className="font-bold text-background text-xl">{totalItems} items</span>
      <Button
        variant="order"
        icon={<ShoppingCart className="font-bold" />}
        onClick={handleOrderClick}
      >
        Order
      </Button>
    </div>
  );
}
