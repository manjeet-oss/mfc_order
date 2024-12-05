import { NextResponse } from 'next/server';

export async function GET() {
  const menu = {
    burgers: [
      {
        id: 1,
        name: 'Cheese Burger',
        price: 9.99,
        imageUrl: '/img/burger.png',
      },
      {
        id: 2,
        name: 'Paneer Burger',
        price: 7.99,
        imageUrl: '/img/burger.png',
      },
      {
        id: 3,
        name: 'Chili Paneer Burger',
        price: 12.99,
        imageUrl: '/img/burger.png',
      },
    ],
    pizzas: [
      {
        id: 4,
        name: 'Margherita Pizza',
        price: 10.99,
        imageUrl: '/img/burger.png',
      },
      {
        id: 5,
        name: 'Pepperoni Pizza',
        price: 11.99,
        imageUrl: '/img/burger.png',
      },
      {
        id: 6,
        name: 'Veggie Pizza',
        price: 8.99,
        imageUrl: '/img/burger.png',
      },
    ],
  };

  return NextResponse.json(menu);
}