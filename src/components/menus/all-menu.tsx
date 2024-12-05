"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import CartFooter from "@/components/menus/cart-footer";
import Loading from "@/components/loading";

interface FoodItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

interface Menu {
  [category: string]: FoodItem[];
}

interface CartItem {
  id: number;
  quantity: number;
}

export default function AllMenu() {
  const [menu, setMenu] = useState<Menu>({});
  const [cart, setCart] = useState<Record<number, CartItem>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [isCartInitialized, setIsCartInitialized] = useState<boolean>(false);

  useEffect(() => {
    // Fetch data from the backend
    async function fetchData() {
      try {
        const response = await fetch("/api/menu");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMenu(data);
      } catch (error) {
        console.error("Error fetching food items:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Load cart from local storage
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    setIsCartInitialized(true);
  }, []);

  useEffect(() => {
    // Save cart to local storage whenever it changes, after initialization
    if (isCartInitialized) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isCartInitialized]);

  const handleAddToCart = (itemId: number) => {
    setCart((prevCart) => ({
      ...prevCart,
      [itemId]: { id: itemId, quantity: 1 },
    }));
  };

  const handleIncreaseQuantity = (itemId: number) => {
    setCart((prevCart) => ({
      ...prevCart,
      [itemId]: { ...prevCart[itemId], quantity: prevCart[itemId].quantity + 1 },
    }));
  };

  const handleDecreaseQuantity = (itemId: number) => {
    setCart((prevCart) => {
      const { [itemId]: itemToRemove, ...rest } = prevCart;
      const newQuantity = itemToRemove.quantity - 1;
      if (newQuantity > 0) {
        return {
          ...rest,
          [itemId]: { ...itemToRemove, quantity: newQuantity },
        };
      }
      return rest;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="menu flex flex-wrap justify-center gap-8 mb-16">
      {Object.entries(menu).map(([category, items]) => (
        <div
          key={category}
          className="border px-2 py-4 md:p-5 rounded-[10px] w-[97%] max-w-md"
        >
          <div className="flex justify-center mb-5">
            <h2 className="text-3xl font-[700]">
              {category.charAt(0).toUpperCase() +
                category.slice(1).toLowerCase()}
            </h2>
          </div>
          <div className="flex flex-col gap-4 w-full">
            {items.map((item, index) => (
              <div key={item.id}>
                <div className="flex justify-between items-center">
                  <div className="flex">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-12 w-auto"
                    />
                    <div className="flex flex-col w-[80%]">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p>&#8377; {item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  {cart[item.id] ? (
                    <div className="flex justify-center items-center h-9">
                      <button
                        className="relative -mr-2 z-10 h-6 w-6 bg-[#fb6218] rounded-md flex items-center justify-center"
                        onClick={() => handleDecreaseQuantity(item.id)}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-lg p-1 bg-foreground text-background rounded w-12 font-semibold flex justify-center items-center">
                        {cart[item.id].quantity}
                      </span>
                      <button
                        className="relative -ml-2 z-10 h-6 w-6 bg-[#fb6218] rounded-md flex items-center justify-center"
                        onClick={() => handleIncreaseQuantity(item.id)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <Button
                      icon={<Plus />}
                      className="add-button font-semibold"
                      onClick={() => handleAddToCart(item.id)}
                    >
                      Add
                    </Button>
                  )}
                </div>
                {index < items.length - 1 && <hr className="my-4" />}
              </div>
            ))}
          </div>
        </div>
      ))}
      <CartFooter cart={cart} />
    </div>
  );
}
