import { useState, useEffect } from 'react';
import { Link, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import {
    FiGrid, FiPackage, FiShoppingBag, FiUsers, FiBarChart2,
    FiPlus, FiEdit, FiTrash2, FiChevronLeft
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement, ArcElement,
    Title, Tooltip, Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import API from '../api/axios';
import Loader from '../components/Loader';
import './AdminDashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

/* ============= OVERVIEW ============= */
const AdminOverview = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await API.get('/admin/stats');
                setStats(data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchStats();
    }, []);

    if (loading) return <Loader />;

    const monthlyData = {
        labels: stats?.monthlySales?.map(m => m.month) || [],
        datasets: [{
            label: 'Revenue ($)',
            data: stats?.monthlySales?.map(m => m.total) || [],
            backgroundColor: 'rgba(108, 99, 255, 0.6)',
            borderColor: '#6c63ff',
            borderWidth: 1,
            borderRadius: 6,
        }],
    };

    const statusData = {
        labels: stats?.ordersByStatus?.map(s => s._id) || [],
        datasets: [{
            data: stats?.ordersByStatus?.map(s => s.count) || [],
            backgroundColor: ['#6c63ff', '#a78bfa', '#10b981', '#f59e0b', '#ef4444'],
        }],
    };

    return (
        <div>
            <h2 className="admin-section-title">Dashboard Overview</h2>
            <div className="stats-grid">
                <div className="stat-card card p-6">
                    <div className="stat-icon" style={{ background: 'rgba(108,99,255,0.15)', color: '#6c63ff' }}>
                        <FiBarChart2 size={24} />
                    </div>
                    <div><p className="stat-label">Total Revenue</p><h3>${stats?.totalRevenue?.toFixed(2) || '0'}</h3></div>
                </div>
                <div className="stat-card card p-6">
                    <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                        <FiShoppingBag size={24} />
                    </div>
                    <div><p className="stat-label">Total Orders</p><h3>{stats?.totalOrders || 0}</h3></div>
                </div>
                <div className="stat-card card p-6">
                    <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                        <FiPackage size={24} />
                    </div>
                    <div><p className="stat-label">Products</p><h3>{stats?.totalProducts || 0}</h3></div>
                </div>
                <div className="stat-card card p-6">
                    <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
                        <FiUsers size={24} />
                    </div>
                    <div><p className="stat-label">Users</p><h3>{stats?.totalUsers || 0}</h3></div>
                </div>
            </div>

            <div className="charts-grid mt-8">
                <div className="card p-6">
                    <h3 className="mb-4">Monthly Revenue</h3>
                    <Bar data={monthlyData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                </div>
                <div className="card p-6">
                    <h3 className="mb-4">Orders by Status</h3>
                    <Doughnut data={statusData} options={{ responsive: true }} />
                </div>
            </div>
        </div>
    );
};

/* ============= ADMIN ORDERS ============= */
const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await API.get('/admin/orders');
                setOrders(data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchOrders();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await API.put(`/orders/${id}/status`, { status });
            setOrders(orders.map(o => o._id === id ? { ...o, orderStatus: status } : o));
            toast.success(`Order updated to ${status}`);
        } catch (err) { toast.error('Failed to update order'); }
    };

    if (loading) return <Loader />;

    return (
        <div>
            <h2 className="admin-section-title">Manage Orders ({orders.length})</h2>
            <div className="table-wrapper mt-4">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>#{order._id.slice(-8)}</td>
                                <td>{order.user?.name || 'N/A'}</td>
                                <td>{order.orderItems?.length}</td>
                                <td>${order.totalPrice?.toFixed(2)}</td>
                                <td>
                                    <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                                        {order.paymentStatus}
                                    </span>
                                </td>
                                <td>
                                    <select
                                        className="form-select"
                                        style={{ minWidth: 120, padding: '4px 8px', fontSize: '0.8rem' }}
                                        value={order.orderStatus}
                                        onChange={(e) => updateStatus(order._id, e.target.value)}
                                    >
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/* ============= ADMIN PRODUCTS ============= */
const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await API.get('/products?limit=100');
                setProducts(data.products || []);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchProducts();
    }, []);

    const deleteProduct = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await API.delete(`/products/${id}`);
            setProducts(products.filter(p => p._id !== id));
            toast.success('Product deleted');
        } catch (err) { toast.error('Failed to delete'); }
    };

    if (loading) return <Loader />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="admin-section-title">Products ({products.length})</h2>
                <Link to="/admin/products/new" className="btn btn-primary btn-sm"><FiPlus /> Add Product</Link>
            </div>
            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr><th>Name</th><th>Price</th><th>Stock</th><th>Category</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p._id}>
                                <td>{p.name}</td>
                                <td>${p.price?.toFixed(2)}</td>
                                <td><span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'}`}>{p.stock}</span></td>
                                <td>{p.category?.name || '-'}</td>
                                <td>
                                    <div className="flex gap-2">
                                        <Link to={`/admin/products/edit/${p._id}`} className="btn btn-secondary btn-sm"><FiEdit /></Link>
                                        <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(p._id)}><FiTrash2 /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/* ============= ADMIN USERS ============= */
const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await API.get('/admin/users');
                setUsers(data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchUsers();
    }, []);

    const toggleRole = async (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        try {
            await API.put(`/admin/users/${id}`, { role: newRole });
            setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
            toast.success(`Role changed to ${newRole}`);
        } catch (err) { toast.error('Failed to update role'); }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Delete this user?')) return;
        try {
            await API.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
            toast.success('User deleted');
        } catch (err) { toast.error('Failed to delete'); }
    };

    if (loading) return <Loader />;

    return (
        <div>
            <h2 className="admin-section-title">Users ({users.length})</h2>
            <div className="table-wrapper mt-4">
                <table className="table">
                    <thead>
                        <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id}>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td><span className={`badge ${u.role === 'admin' ? 'badge-info' : 'badge-success'}`}>{u.role}</span></td>
                                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <div className="flex gap-2">
                                        <button className="btn btn-secondary btn-sm" onClick={() => toggleRole(u._id, u.role)}>
                                            {u.role === 'admin' ? 'Demote' : 'Promote'}
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u._id)}><FiTrash2 /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/* ============= ADMIN PRODUCT FORM ============= */
const AdminProductForm = ({ editMode = false }) => {
    const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category: '', featured: false });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState(null);

    useEffect(() => {
        API.get('/categories').then(r => setCategories(r.data)).catch(() => { });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([k, v]) => formData.append(k, v));
            if (images) {
                Array.from(images).forEach(f => formData.append('images', f));
            }
            if (editMode) {
                // edit mode would need id from params
                toast.info('Edit mode — update API call');
            } else {
                await API.post('/products', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Product created!');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Link to="/admin/products" className="btn btn-secondary btn-sm mb-4"><FiChevronLeft /> Back to Products</Link>
            <h2 className="admin-section-title">{editMode ? 'Edit Product' : 'Add New Product'}</h2>
            <form className="card p-6 mt-4" onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
                <div className="form-group">
                    <label className="form-label">Product Name</label>
                    <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-input" rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
                </div>
                <div className="grid-2">
                    <div className="form-group">
                        <label className="form-label">Price ($)</label>
                        <input type="number" step="0.01" className="form-input" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Stock</label>
                        <input type="number" className="form-input" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                        <option value="">Select category</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Images</label>
                    <input type="file" multiple accept="image/*" className="form-input" onChange={e => setImages(e.target.files)} />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 16 }}>
                    <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                    Mark as Featured
                </label>
                <button className="btn btn-primary btn-lg btn-block" disabled={loading}>
                    {loading ? 'Saving...' : (editMode ? 'Update Product' : 'Create Product')}
                </button>
            </form>
        </div>
    );
};

/* ============= ADMIN LAYOUT ============= */
const AdminDashboard = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <div className="page-wrapper">
            <div className="container">
                <div className="admin-layout">
                    <aside className="admin-sidebar card p-4">
                        <h3 className="admin-sidebar-title">Admin Panel</h3>
                        <nav className="admin-nav">
                            <Link to="/admin" className={`admin-nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                                <FiGrid /> Overview
                            </Link>
                            <Link to="/admin/orders" className={`admin-nav-link ${isActive('/admin/orders') ? 'active' : ''}`}>
                                <FiShoppingBag /> Orders
                            </Link>
                            <Link to="/admin/products" className={`admin-nav-link ${isActive('/admin/products') ? 'active' : ''}`}>
                                <FiPackage /> Products
                            </Link>
                            <Link to="/admin/users" className={`admin-nav-link ${isActive('/admin/users') ? 'active' : ''}`}>
                                <FiUsers /> Users
                            </Link>
                        </nav>
                    </aside>

                    <main className="admin-main">
                        <Routes>
                            <Route index element={<AdminOverview />} />
                            <Route path="orders" element={<AdminOrders />} />
                            <Route path="products" element={<AdminProducts />} />
                            <Route path="products/new" element={<AdminProductForm />} />
                            <Route path="products/edit/:id" element={<AdminProductForm editMode />} />
                            <Route path="users" element={<AdminUsers />} />
                            <Route path="*" element={<Navigate to="/admin" replace />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
