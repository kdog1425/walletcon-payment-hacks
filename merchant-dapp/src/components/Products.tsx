import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PaymentItem } from "../interfaces";
import {SKey, SRow, STable, SValue} from "./shared";
import Image from "next/image";
import Button from "./Button";

const PRODUCTS: PaymentItem[] = [
  {
    id: 'product1',
    description: 'WalletConnect T-Shirt',
    image: '/assets/products/shirt.jpg',
    unit_price: 20.5,
  },
  {
    id: 'product2',
    description: 'Pasteis de Nata (3 units)',
    image: '/assets/products/de-nata.jpg',
    unit_price: 9.99,
  },
  {
    id: 'product3',
    description: '🔥WiFi Powder - Instant Internet',
    unit_price: 37.9,
  },
];

interface ProductsProps {
  onBuy: (productId: string) => void;
}

export function Products({ onBuy }: ProductsProps) {
  const [products, setProducts] = useState<PaymentItem[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setProducts(PRODUCTS);
    };

    fetchProducts();
  });

  return <STable>
    {products.map((product, i) => (
      <SRow key={i} style={{background: i & 1 ? 'WhiteSmoke' : 'White', padding: '10px' }}>
        <SValue>
          <Image
            width="100%"
            height="100%"
            objectFit='cover'
            src={product.image ?? '/assets/products/no-image.svg'}
            style={{borderRadius: '5px', border: '2px solid black'}}
            alt="Product image"/>
        </SValue>
        <SKey>
          <SRow>
            <SKey>{product.description}</SKey>
            <SValue>${product.unit_price}</SValue>
          </SRow>
          <SRow></SRow>
          <SRow>
            <SKey></SKey>
            <SValue><Button onClick={() => {onBuy(product.id!)}}>Buy now</Button></SValue>
          </SRow>
        </SKey>
      </SRow>
    ))}
  </STable>;
}