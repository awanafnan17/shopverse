import { useState, useEffect } from 'react';
import { FiUser, FiPackage, FiEdit } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Loader from '../components/Loader';
import './Profile.css';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '' });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await API.get('/orders/me');
                setOrders(data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchOrders();
    }, []);

    useEffect(() => {
        if (user) setForm({ name: user.name || '', phone: user.phone || '' });
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(form);
            toast.success('Profile updated!');
            setEditing(false);
        } catch (err) {
            toast.error('Failed to update profile');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="page-wrapper">
            <div className="container">
                <div className="profile-layout">
                    {/* Profile Info */}
                    <div className="profile-sidebar card p-6">
                        <div className="profile-avatar">
                            <FiUser size={32} />
                        </div>
                        <h2>{user?.name}</h2>
                        <p className="text-muted">{user?.email}</p>
                        <span className={`badge ${user?.role === 'admin' ? 'badge-info' : 'badge-success'} mt-2`}>
                            {user?.role}
                        </span>

                        {editing ? (
                            <form className="mt-4" onSubmit={handleUpdateProfile}>
                                <div className="form-group">
                                    <label className="form-label">Name</label>
                                    <input className="form-input" value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input className="form-input" value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                                </div>
                                <div className="flex gap-2">
                                    <button className="btn btn-primary btn-sm">Save</button>
                                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing(false)}>Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <button className="btn btn-secondary btn-sm btn-block mt-4" onClick={() => setEditing(true)}>
                                <FiEdit /> Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Orders */}
                    <div className="profile-orders">
                        <h2 className="mb-6"><FiPackage /> My Orders ({orders.length})</h2>

                        {orders.length === 0 ? (
                            <div className="empty-state"><p className="text-muted">You haven't placed any orders yet.</p></div>
                        ) : (
                            <div className="orders-list">
                                {orders.map((order) => (
                                    <div key={order._id} className="order-card card p-4 mb-4">
                                        <div className="order-header">
                                            <div>
                                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Order #{order._id.slice(-8)}</span>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className={`badge ${order.orderStatus === 'delivered' ? 'badge-success' :
                                                    order.orderStatus === 'cancelled' ? 'badge-danger' : 'badge-info'}`}>
                                                    {order.orderStatus}
                                                </span>
                                                <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                                                    {order.paymentStatus}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="order-items-list mt-2">
                                            {order.orderItems?.map((item, i) => (
                                                <span key={i} className="order-item-name">{item.name} × {item.quantity}</span>
                                            ))}
                                        </div>
                                        <div className="order-footer mt-2">
                                            <span className="text-muted">{order.paymentMethod === 'stripe' ? '💳 Stripe' : '💵 COD'}</span>
                                            <strong>${order.totalPrice?.toFixed(2)}</strong>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
