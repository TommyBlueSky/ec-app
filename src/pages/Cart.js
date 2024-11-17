import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cart, setCart] = useState([]);  // カート内の商品
  const [products, setProducts] = useState([]);  // 商品情報
  const [totalAmount, setTotalAmount] = useState(0);  // 合計金額
  const navigate = useNavigate();

  useEffect(() => {
    // カートのデータと商品情報を取得する非同期関数
    const fetchData = async () => {
      try {
        // 商品情報をバックエンドから取得
        const productsResponse = await fetch('http://localhost:4000/api/products');
        const productsData = await productsResponse.json();
        setProducts(productsData);

        // カートの情報をバックエンドから取得
        const cartResponse = await fetch('http://localhost:4000/api/cart');
        const cartData = await cartResponse.json();
        setCart(cartData);

        // 初期の合計金額を計算
        const total = calculateTotalAmount(cartData, productsData);
        setTotalAmount(total);
      } catch (error) {
        console.error('カートの取得エラー:', error);
      }
    };

    fetchData();
  }, []);

  // 合計金額を計算する関数
  const calculateTotalAmount = (cartItems, productsList) => {
    return cartItems.reduce((sum, item) => {
      const product = productsList.find(p => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const removeFromCart = async (productId) => {
    try {
      // カートから商品を削除するAPI呼び出し
      const response = await fetch('http://localhost:4000/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      if (response.ok) {
        // 削除後のカートデータを再取得
        const updatedCart = cart.filter(item => item.productId !== productId);
        setCart(updatedCart);
        // 合計金額を再計算
        const total = calculateTotalAmount(updatedCart, products);
        setTotalAmount(total);
      } else {
        alert('商品削除に失敗しました');
      }
    } catch (error) {
      console.error('カートから商品削除エラー:', error);
    }
  };

  const placeOrder = async () => {
    try {
      // 注文するAPI呼び出し
      const response = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, totalAmount })
      });
      if (response.ok) {
        const data = await response.json();
        alert(`注文が完了しました！ 注文ID: ${data.orderId}`);
        setCart([]);
        setTotalAmount(0);
        navigate('/');
      } else {
        alert('注文に失敗しました');
      }
    } catch (error) {
      console.error('注文の確定エラー:', error);
    }
  };

  return (
    <div>
      <h2>カート</h2>
      {cart.length === 0 ? (
        <p>カートは空です</p>
      ) : (
        <div>
          <h3>カートに入っている商品</h3>
          {cart.map((item) => {
            const product = products.find(p => p.id === item.productId);
            return product ? (
              <div key={item.productId}>
                <p>{product.name} - {item.quantity} 個</p>
                <p>合計: {product.price * item.quantity}円</p>
                <button onClick={() => removeFromCart(item.productId)}>削除</button>
              </div>
            ) : (
              <div key={item.productId}>商品が見つかりません</div>
            );
          })}
          <h3>合計金額: {totalAmount}円</h3>
          <button onClick={placeOrder}>注文を確定</button>
        </div>
      )}
    </div>
  );
}

export default Cart;