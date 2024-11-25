import React, { useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import Cart from './pages/Cart';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import ProductList from './pages/ProductList';
import Register from './pages/Register';

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ログイン状態の確認（実行は各コンポーネント）
  const checkUser = async (cartComponent, ProductDetailComponent) => {
    try {
      const response = await fetch('http://localhost:4000/api/user', {
        method: 'POST',
        credentials: 'include'  // クッキーを送信
      });
        const data = await response.json();
      if (response.ok) {
        setUser(data);  // ログインしているユーザー情報を取得
        return data;
      } 
      if (response.status === 401 && (cartComponent || ProductDetailComponent)) {
        alert('ログインしてください。会員でなければ新規会員登録を行ってください。');
        navigate('/login');
      }
    } catch (error) {
      setUser(null);  // ログインしていない
    }
  };

  //ログアウト処理
  const handleLogout = async (e) => {
    e.preventDefault();
    try{
      const response = await fetch('http://localhost:4000/api/logout', {
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setUser(null);
        navigate('/');
      } else {
        alert(data.message);
      }
    } catch(error) {
      console.error('ログアウトエラー:', error);
    }
  };

  return (
      <div>
        <h1>ECサイト</h1>
        <nav>
          <Link to="/">ホーム</Link>｜
          {user ? (
            <>
              <Link to="/cart">カート</Link>｜
              <span>
                {user.username}
                （<a href="#" onClick={handleLogout}>ログアウト</a>）
              </span>
            </>
          ) : (
            <>
              <Link to="/login">ログイン</Link>｜
              <Link to="/register">新規会員登録</Link>
            </>
          )}
        </nav>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProductList checkUser={checkUser} />} />
          <Route path="/cart" element={<Cart checkUser={checkUser} user={user} />} />
          <Route path="/product/:productId" element={<ProductDetail checkUser={checkUser} user={user} />} />
        </Routes>
      </div>
  )
}

export default App;