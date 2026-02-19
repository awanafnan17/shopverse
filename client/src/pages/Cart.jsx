import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="page-wrapper container text-center">
                <div className="empty-cart animate-fade-in">
                    <FiShoppingBag size={64} className="text-muted" />
                    <h2>Your cart is empty</h2>
                    <p className="text-muted">Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/products" className="btn btn-primary btn-lg mt-4">
                        Browse Products <FiArrowRight />
                    </Link>
                </div>
            </div>
        );
    }

    const imageUrl = (item) =>
        item.images?.[0]
            ? (item.images[0].startsWith('http') ? item.images[0] : `http://localhost:5000${item.images[0]}`)
            : `https://placehold.co/100x100/1a1a2e/6c63ff?text=${encodeURIComponent(item.name?.slice(0, 8))}`;

    return (
        <div className="page-wrapper">
            <div className="container">
                <h1 className="mb-6">Shopping Cart ({cartCount} items)</h1>

                <div className="cart-layout">
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item._id} className="cart-item card animate-fade-in">
                                <img src={imageUrl(item)} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-info">
                                    <Link to={`/products/${item._id}`} className="cart-item-name">{item.name}</Link>
                                    <span className="cart-item-price">${item.price?.toFixed(2)}</span>
                                </div>
                                <div className="quantity-control">
                                    <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                                        <FiMinus />
                                    </button>
                                    <span className="qty-value">{item.quantity}</span>
                                    <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                                        <FiPlus />
                                    </button>
                                </div>
                                <span className="cart-item-subtotal">${(item.price * item.quantity).toFixed(2)}</span>
                                <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item._id)}>
                                    <FiTrash2 />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary card p-6">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>{cartTotal > 50 ? 'Free' : '$5.99'}</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax (est.)</span>
                            <span>${(cartTotal * 0.08).toFixed(2)}</span>
                        </div>
                        <div className="summary-divider" />
                        <div className="summary-row summary-total">
                            <span>Total</span>
                            <span>${(cartTotal + (cartTotal > 50 ? 0 : 5.99) + cartTotal * 0.08).toFixed(2)}</span>
                        </div>
                        <button className="btn btn-primary btn-lg btn-block mt-4" onClick={() => navigate('/checkout')}>
                            Proceed to Checkout <FiArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
