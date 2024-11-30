import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ProductList({checkUser}) {
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
    checkUser();
  }, []);

  return (
    <div>
      <h2>商品一覧</h2>
      {products.map(product => (
        <div key={product.product_id}>
          <h3>{product.name}</h3>
          <p>
            {product.price}円
            {product.stock <= 0 ? (
              <span style={{'color': 'red'}}> 売り切れ</span>
            ) : product.stock <= 10 ? (
              <span>（残り{product.stock}個）</span>
            ) : null}
          </p>
          <Link to={`/product/${product.product_id}`}>詳細を見る</Link>
        </div>
      ))}
    </div>
  );
}

export default ProductList;