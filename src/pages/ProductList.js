import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try{
        const response = await fetch('http://localhost:4000/api/products');
        const data = await response.json();
        setProducts(data);
      } catch(error) {
        console.error('商品情報の取得エラー:', error)
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h2>商品一覧</h2>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.price}円</p>
          <Link to={`/product/${product.id}`}>詳細を見る</Link>
        </div>
      ))}
    </div>
  );
}

export default ProductList;