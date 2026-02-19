import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage } from 'react-icons/fi';
import API from '../api/axios';
import Loader from '../components/Loader';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await API.get(`/orders/${id}`);
                setOrder(data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchOrder();
    }, [id]);

    if (loading) return <Loader />;
    if (!order) return <div className="page-wrapper container text-center"><h2>Order not found</h2></div>;

    return (
        <div className="page-wrapper">
            <div className="container">
                <div className="confirmation-card card p-8 text-center animate-fade-in">
                    <FiCheckCircle size={64} className="text-accent" />
                    <h1 className="mt-4">Order Confirmed!</h1>
                    <p className="text-muted mt-2">Thank you for your purchase.</p>

                    <div className="order-details mt-6">
                        <div className="detail-row">
                            <span>Order ID</span>
                            <strong>{order._id}</strong>
                        </div>
                        <div className="detail-row">
                            <span>Status</span>
                            <span className="badge badge-info">{order.orderStatus}</span>
                        </div>
                        <div className="detail-row">
                            <span>Payment</span>
                            <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                                {order.paymentStatus}
                            </span>
                        </div>
                        <div className="detail-row">
                            <span>Method</span>
                            <span>{order.paymentMethod === 'stripe' ? '💳 Stripe' : '💵 Cash on Delivery'}</span>
                        </div>
                        <div className="detail-row">
                            <span>Total</span>
                            <strong>${order.totalPrice?.toFixed(2)}</strong>
                        </div>
                    </div>

                    <div className="order-items mt-6">
                        <h3 className="mb-4"><FiPackage /> Items Ordered</h3>
                        {order.orderItems?.map((item, i) => (
                            <div key={i} className="confirmation-item">
                                <span>{item.name} × {item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="confirmation-actions mt-6">
                        <Link to="/profile" className="btn btn-secondary">View My Orders</Link>
                        <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
