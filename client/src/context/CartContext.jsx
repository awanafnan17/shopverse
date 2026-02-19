import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const stored = localStorage.getItem('cart');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Validate cart items against the database on mount
    // Removes items whose product IDs no longer exist (e.g. after DB restart)
    const validateCart = useCallback(async () => {
        if (cartItems.length === 0) return;
        try {
            const { data } = await API.get('/products?limit=200');
            const validIds = new Set((data.products || []).map(p => p._id));
            setCartItems(prev => {
                const filtered = prev.filter(item => validIds.has(item._id));
                if (filtered.length !== prev.length) {
                    console.log(`🛒 Cart: removed ${prev.length - filtered.length} stale item(s)`);
                }
                return filtered.length !== prev.length ? filtered : prev;
            });
        } catch {
            // API not available yet, skip validation
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        validateCart();
    }, [validateCart]);

    const addToCart = (product, quantity = 1) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item._id === product._id);
            if (existing) {
                return prev.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: Math.min(item.quantity + quantity, item.stock) }
                        : item
                );
            }
            return [...prev, { ...product, quantity: Math.min(quantity, product.stock) }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prev) => prev.filter((item) => item._id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return removeFromCart(productId);
        setCartItems((prev) =>
            prev.map((item) =>
                item._id === productId
                    ? { ...item, quantity: Math.min(quantity, item.stock) }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, validateCart }}
        >
            {children}
        </CartContext.Provider>
    );
};
