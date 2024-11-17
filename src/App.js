import React from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import ProductList from './pages/ProductList';

const App = () => {
  return (
    <Router>
      <div>
        <h1>ECサイト</h1>
        <nav>
          <Link to="/">ホーム</Link> | <Link to="/cart">カート</Link>
        </nav>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;