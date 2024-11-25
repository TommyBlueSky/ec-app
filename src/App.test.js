import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import ProductList from './pages/ProductList';

describe('1.レンダリングチェック', () => {
  test('1.1 ECサイトの文字が表示されているか', () => {
    render(<App />);
    expect(screen.getByText('ECサイト')).toBeInTheDocument();
  });
  test('1.2 ホームの文字が表示されているか', () => {
    render(<App />);
    expect(screen.getByText('ホーム')).toBeInTheDocument();
  });
  test('1.3 カートの文字が表示されているか', () => {
    render(<App />);
    expect(screen.getByText('カート')).toBeInTheDocument();
  });
});

describe('2.ナビゲーションのリンクチェック', () => {
  test('2.1 ホームのリンクが合っているか', () => {
    render(<App />);
    fireEvent.click(screen.getByText('ホーム'));
    expect(window.location.pathname).toBe('/');
  });
  test('2.2 カートのリンクが合っているか', () => {
    render(<App />);
    fireEvent.click(screen.getByText('カート'));
    expect(window.location.pathname).toBe('/cart');
  });
});

describe('3.ルーティングチェック', () => {
  test('3.1 商品一覧コンポーネントが表示されるか', async () => {
    render(<MemoryRouter><ProductList /></MemoryRouter>);
    expect(await screen.findByText('商品一覧')).toBeInTheDocument();
  });
  test('3.2 商品詳細コンポーネントが表示されるか', async () => {
    render(<MemoryRouter><ProductDetail /></MemoryRouter>);
    expect(await screen.findByText('カートに追加')).toBeInTheDocument();
  });
  test('3.3 カートコンポーネントが表示されるか', async () => {
    render(<MemoryRouter><Cart /></MemoryRouter>);
    expect(await screen.findByRole('heading', {name: 'カート'})).toBeInTheDocument();
  });
});