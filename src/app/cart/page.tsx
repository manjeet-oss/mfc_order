"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import DiscountCoupon from "@/components/cart/DiscountCoupon";

interface FoodItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

interface CartItem {
  id: number;
  quantity: number;
}

export default function CartPage() {
  const [menu, setMenu] = useState<Record<number, FoodItem>>({});
  const [cart, setCart] = useState<Record<number, CartItem>>({});
  const [isCartInitialized, setIsCartInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [discountedTotal, setDiscountedTotal] = useState<number | null>(null);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await fetch("/api/menu");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Record<string, FoodItem[]> = await response.json();
        const flatMenu = Object.values(data)
          .flat()
          .reduce((acc, item) => {
            acc[item.id] = item;
            return acc;
          }, {} as Record<number, FoodItem>);
        setMenu(flatMenu);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();

    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
      setIsCartInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isCartInitialized) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isCartInitialized]);

  useEffect(() => {
    const newTotal = Object.keys(cart).reduce((sum, itemId) => {
      const item = menu[+itemId];
      if (!item) return sum;
      return sum + cart[+itemId].quantity * item.price;
    }, 0);
    setTotal(newTotal);
    if (discountedTotal !== null) {
      setDiscountedTotal(newTotal);
    }
  }, [cart, menu]);

  const handleIncreaseQuantity = (itemId: number) => {
    setCart((prevCart) => ({
      ...prevCart,
      [itemId]: {
        ...prevCart[itemId],
        quantity: prevCart[itemId].quantity + 1,
      },
    }));
  };

  const handleDecreaseQuantity = (itemId: number) => {
    setCart((prevCart) => {
      const newQuantity = prevCart[itemId].quantity - 1;
      if (newQuantity <= 0) {
        const { [itemId]: _, ...rest } = prevCart; // Fix: Remove unused variable
        return rest;
      }
      return {
        ...prevCart,
        [itemId]: { ...prevCart[itemId], quantity: newQuantity },
      };
    });
  };

  const applyDiscount = (discountedTotal: number) => {
    setDiscountedTotal(discountedTotal);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-5 py-10 md:p-10">
      <div className="header flex w-full justify-center mb-10">
        <h1 className="text-5xl font-bold uppercase">
          <span className="text-[#fb6218]">Cart</span>
        </h1>
      </div>
      {Object.keys(cart).length === 0 ? (
        <div className="header flex w-full justify-center">
          <p className="text-xl font-bold">Your cart is empty.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-4 border px-2 py-4 md:p-5 rounded-[10px] w-[97%] max-w-md">
            {Object.entries(cart).map(([itemId]) => {
              const item = menu[parseInt(itemId)];
              if (!item) return null;
              return (
                <div key={item.id}>
                  <div className="flex justify-between items-center">
                    <div className="flex">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-12 w-auto"
                      />
                      <div className="flex flex-col w-[80%] ml-2">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p>&#8377; {item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex justify-center items-center h-9">
                      <button
                        className="relative -mr-2 z-10 h-4 w-4 bg-[#fb6218] rounded-md flex items-center justify-center"
                        onClick={() => handleDecreaseQuantity(item.id)}
                      >
                        <Minus size={13} />
                      </button>
                      <span className="text-md p-1 bg-foreground text-background rounded w-10 h-7 font-semibold flex justify-center items-center">
                        {cart[item.id].quantity}
                      </span>
                      <button
                        className="relative -ml-2 z-10 h-4 w-4 bg-[#fb6218] rounded-md flex items-center justify-center"
                        onClick={() => handleIncreaseQuantity(item.id)}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col item-center justify-center border rounded-md p-6 gap-5">
            <DiscountCoupon
              cart={cart}
              menu={menu}
              applyDiscount={applyDiscount}
            />
            <h1 className=" flex w-full justify-center text-lg font-semibold">
              Total: &#8377;{" "}
              {discountedTotal !== null
                ? discountedTotal.toFixed(2)
                : total.toFixed(2)}
            </h1>
          </div>
        </div>
      )}
      <div className="fixed bottom-0 left-0 right-0 p-4 shadow-md">
        <Button variant="order" className="w-full font-bold text-xl" size="xl">
          Pay &#8377;{" "}
          {discountedTotal !== null
            ? discountedTotal.toFixed(2)
            : total.toFixed(2)}
        </Button>
      </div>
    </div>
  );
}
