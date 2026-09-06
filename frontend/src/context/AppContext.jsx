import { createContext, useContext, useEffect, useMemo, useState } from 'react'; import { api } from '../services/api.js';
const AppContext = createContext(); export const useApp = () => useContext(AppContext);
const dictionary = { es: { home: 'Inicio', catalog: 'Catálogo', favorites: 'Favoritos', orders: 'Mis pedidos', login: 'Ingresar', cart: 'Carrito', viewCatalog: 'Ver catálogo', addedCart: 'Producto agregado al carrito.', loginRequired: 'Debes iniciar sesión para continuar.' }, en: { home: 'Home', catalog: 'Catalog', favorites: 'Favorites', orders: 'My orders', login: 'Sign in', cart: 'Cart', viewCatalog: 'View catalog', addedCart: 'Product added to cart.', loginRequired: 'Please sign in to continue.' } };
export function AppProvider({ children }) {
  const [user, setUser] = useState(null), [cart, setCart] = useState({ items: [] }), [theme, setTheme] = useState(localStorage.getItem('artemabel_theme') || 'light'), [language, setLanguage] = useState(localStorage.getItem('artemabel_lang') || 'es'), [notice, setNotice] = useState(null);
  const notify = message => { setNotice(message); setTimeout(() => setNotice(null), 3500); };
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('artemabel_theme', theme); }, [theme]); useEffect(() => localStorage.setItem('artemabel_lang', language), [language]);
  const refreshSession = async () => { try { const { user: u } = await api('/auth/me'); setUser(u); const { cart: c } = await api('/cart'); setCart(c || { items: [] }); } catch { localStorage.removeItem('artemabel_token'); setUser(null); setCart({ items: [] }); } };
  useEffect(() => { if (localStorage.getItem('artemabel_token')) refreshSession(); }, []);
  const authenticate = async (path, data) => { const response = await api(path, { method: 'POST', body: JSON.stringify(data) }); localStorage.setItem('artemabel_token', response.token); setUser(response.user); const { cart: c } = await api('/cart'); setCart(c || { items: [] }); return response.user; };
  const logout = () => { localStorage.removeItem('artemabel_token'); setUser(null); setCart({ items: [] }); };
  const refreshCart = async () => { const { cart: c } = await api('/cart'); setCart(c || { items: [] }); };
  const value = useMemo(() => ({ user, cart, theme, language, t: dictionary[language], notice, notify, setTheme, setLanguage, authenticate, logout, refreshSession, refreshCart }), [user, cart, theme, language, notice]); return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
