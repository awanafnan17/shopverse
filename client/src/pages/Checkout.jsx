import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiCreditCard, FiTruck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import './Checkout.css';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [shipping, setShipping] = useState({
        fullName: user?.name || '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phone: '',
    });
    const [card, setCard] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: '',
    });

    const shippingPrice = cartTotal > 50 ? 0 : 5.99;
    const taxPrice = +(cartTotal * 0.08).toFixed(2);
    const total = cartTotal + shippingPrice + taxPrice;

    const handleChange = (e) => {
        setShipping({ ...shipping, [e.target.name]: e.target.value });
    };

    const handleCardChange = (e) => {
        let { name, value } = e.target;

        if (name === 'number') {
            value = value.replace(/\D/g, '').slice(0, 16);
            value = value.replace(/(.{4})/g, '$1 ').trim();
        }
        if (name === 'expiry') {
            value = value.replace(/\D/g, '').slice(0, 4);
            if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
        }
        if (name === 'cvc') {
            value = value.replace(/\D/g, '').slice(0, 4);
        }

        setCard({ ...card, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) return toast.error('Your cart is empty');

        // Validate card details if stripe
        if (paymentMethod === 'stripe') {
            const cardNum = card.number.replace(/\s/g, '');
            if (cardNum.length < 13) return toast.error('Please enter a valid card number');
            if (card.expiry.length < 5) return toast.error('Please enter a valid expiry date');
            if (card.cvc.length < 3) return toast.error('Please enter a valid CVC');
            if (!card.name.trim()) return toast.error('Please enter the cardholder name');
        }

        setLoading(true);
        try {
            // Create order
            const orderData = {
                orderItems: cartItems.map((item) => ({
                    product: item._id,
                    quantity: item.quantity,
                })),
                shippingAddress: shipping,
                paymentMethod,
                taxPrice,
                shippingPrice,
            };

            const { data: order } = await API.post('/orders', orderData);

            if (paymentMethod === 'stripe') {
                // Create stripe payment intent
                const { data: payment } = await API.post('/payments/stripe', {
                    amount: total,
                    orderId: order._id,
                });

                // Confirm payment
                await API.post('/payments/stripe/confirm', {
                    paymentIntentId: payment.paymentIntentId,
                    orderId: order._id,
                });

                toast.success('Payment successful!');
            } else {
                // COD
                await API.post('/payments/cod', { orderId: order._id });
                toast.success('Order placed! Pay on delivery.');
            }

            clearCart();
            navigate(`/order-confirmation/${order._id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error placing order');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="page-wrapper">
            <div className="container">
                <h1 className="mb-6">Checkout</h1>

                <form className="checkout-layout" onSubmit={handleSubmit}>
                    <div className="checkout-form">
                        <div className="card p-6 mb-6">
                            <h2>Shipping Address</h2>
                            <div className="grid-2 mt-4">
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input className="form-input" name="fullName" value={shipping.fullName} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input className="form-input" name="phone" value={shipping.phone} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Street Address</label>
                                <input className="form-input" name="street" value={shipping.street} onChange={handleChange} required />
                            </div>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">City</label>
                                    <input className="form-input" name="city" value={shipping.city} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">State / Province</label>
                                    <input className="form-input" name="state" value={shipping.state} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">Zip / Postal Code</label>
                                    <input className="form-input" name="zipCode" value={shipping.zipCode} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Country</label>
                                    <input className="form-input" name="country" value={shipping.country} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        <div className="card p-6">
                            <h2>Payment Method</h2>
                            <div className="payment-options mt-4">
                                <label className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                    />
                                    <div>
                                        <strong><FiTruck style={{ marginRight: 6 }} /> Cash on Delivery</strong>
                                        <p>Pay when your order is delivered</p>
                                    </div>
                                </label>
                                <label className={`payment-option ${paymentMethod === 'stripe' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="stripe"
                                        checked={paymentMethod === 'stripe'}
                                        onChange={() => setPaymentMethod('stripe')}
                                    />
                                    <div>
                                        <strong><FiCreditCard style={{ marginRight: 6 }} /> Credit / Debit Card</strong>
                                        <p>Secure payment via Stripe</p>
                                    </div>
                                </label>
                            </div>

                            {paymentMethod === 'stripe' && (
                                <div className="card-details mt-4 animate-fade-in">
                                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 12 }}>Card Details</h3>
                                    <div className="form-group">
                                        <label className="form-label">Cardholder Name</label>
                                        <input
                                            className="form-input"
                                            name="name"
                                            placeholder="John Doe"
                                            value={card.name}
                                            onChange={handleCardChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Card Number</label>
                                        <input
                                            className="form-input"
                                            name="number"
                                            placeholder="4242 4242 4242 4242"
                                            value={card.number}
                                            onChange={handleCardChange}
                                            maxLength={19}
                                            required
                                        />
                                    </div>
                                    <div className="grid-2">
                                        <div className="form-group">
                                            <label className="form-label">Expiry Date</label>
                                            <input
                                                className="form-input"
                                                name="expiry"
                                                placeholder="MM/YY"
                                                value={card.expiry}
                                                onChange={handleCardChange}
                                                maxLength={5}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">CVC</label>
                                            <input
                                                className="form-input"
                                                name="cvc"
                                                placeholder="123"
                                                value={card.cvc}
                                                onChange={handleCardChange}
                                                maxLength={4}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <p className="card-secure-note">
                                        🔒 Your payment info is encrypted and secure
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="checkout-summary card p-6">
                        <h3>Order Summary</h3>
                        <div className="checkout-items">
                            {cartItems.map((item) => (
                                <div key={item._id} className="checkout-item">
                                    <span>{item.name} × {item.quantity}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="summary-divider" />
                        <div className="summary-row"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                        <div className="summary-row"><span>Shipping</span><span>{shippingPrice === 0 ? 'Free' : `$${shippingPrice}`}</span></div>
                        <div className="summary-row"><span>Tax</span><span>${taxPrice.toFixed(2)}</span></div>
                        <div className="summary-divider" />
                        <div className="summary-row summary-total"><span>Total</span><span>${total.toFixed(2)}</span></div>

                        <button className="btn btn-primary btn-lg btn-block mt-4" disabled={loading}>
                            {loading ? 'Processing...' : `Place Order — $${total.toFixed(2)}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
