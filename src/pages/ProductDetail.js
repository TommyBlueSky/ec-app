import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetail({checkUser, user}) {
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
    checkUser('ProductDetailComponent');
    if (!user) return;
    
    if (quantity > product.stock) {
      alert('在庫数が足りません。');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/cart', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user_id: user.user_id, product_id: product.product_id, quantity})
      });
      if (response.ok) {
        alert('商品がカートに追加されました');
      } else {
        const data = await response.json();
        alert(data.message);
        product.stock = data.stock;
        setQuantity(1);
      }
    } catch(error) {
      console.error('カートへの追加エラー:', error);
    }
  };

  if (!product) return <div>読み込み中...</div>;

  return (
    <div>
      <h2>{product.name}</h2>
      <p>
        価格: {product.price}円
        {product.stock <= 0 ? (
          <span style={{'color': 'red'}}> 売り切れ</span>
        ) : product.stock <= 10 ? (
          <span>（残り{product.stock}個）</span>
        ) : null}
      </p>
      <p>{product.description}</p>
      <label>数量: 
        <input 
          type="number" 
          value={quantity} 
          onChange={handleQuantityChange} 
          min="1" 
          max={product.stock} 
          disabled={product.stock <= 0}
        />
      </label>
      <button onClick={addToCart} disabled={product.stock <= 0}>カートに追加</button>
    </div>
  );
}

export default ProductDetail;
