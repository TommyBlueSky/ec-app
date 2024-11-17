import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cart, setCart] = useState([]);  // カート内の商品
  const [products, setProducts] = useState([]);  // 商品情報
  const [totalAmount, setTotalAmount] = useState(0);  // 合計金額
  const [isOrderError, setIsOrderError] = useState(false);  // 注文確定ボタンの可否
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

        // 在庫確認の処理
        const outOfStock = checkStockItems(cartData, productsData);
        setIsOrderError(outOfStock);
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

  // 在庫確認の関数
  const checkStockItems = (cartItems, productsList) => {
    return cartItems.some(item => {
      const product = productsList.find(p => p.id === item.productId);
      return product && product.stock < item.quantity;
    });
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
        // 在庫確認の処理
        const outOfStock = checkStockItems(updatedCart, products);
        setIsOrderError(outOfStock);
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
        const data = await response.json();
        alert(data.message);
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
                <p>{product.name} - {item.quantity} 個
                  {product.stock <= 0 ? (
                    <span style={{'color': 'red'}}>（売り切れ）</span>
                  ) : product.stock <= 10 && product.stock >= item.quantity ? (
                    <span>（残り{product.stock}個）</span>
                  ) : product.stock < item.quantity ? (
                    <span style={{'color': 'red'}}>（在庫不足 残り{product.stock}個）</span>
                  ) : null}
                </p>
                <p>合計: {product.price * item.quantity}円</p>
                <button onClick={() => removeFromCart(item.productId)}>削除</button>
              </div>
            ) : (
              <div key={item.productId}>商品が見つかりません</div>
            );
          })}
          <h3>合計金額: {totalAmount}円</h3>
          <button onClick={placeOrder} disabled={isOrderError}>注文を確定</button>
          {isOrderError && (
            <p style={{ color: 'red' }}>
              売り切れまたは在庫不足の商品があります。対象商品を削除して注文を確定してください。
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Cart;
