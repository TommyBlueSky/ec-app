import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { productId } = useParams();  // URLパラメータから商品IDを取得
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // 商品情報を取得
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/products/${productId}`);
        const data = await response.json();
        setProduct(data);
      } catch(error) {
        console.error('商品詳細の取得エラー:', error);
      }
    }
    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  const addToCart = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/cart', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({productId: product.id, quantity})
      });
      await response.json();
      alert('商品がカートに追加されました');

    } catch(error) {
      console.error('カートへの追加エラー:', error);
    }
  };

  if (!product) return <div>読み込み中...</div>;

  return (
    <div>
      <h2>{product.name}</h2>
      <p>価格: {product.price}円</p>
      <p>{product.description}</p>
      <label>数量: </label>
      <input 
        type="number" 
        value={quantity} 
        onChange={handleQuantityChange} 
        min="1" 
        max="99" 
      />
      <button onClick={addToCart}>カートに追加</button>
    </div>
  );
}

export default ProductDetail;
