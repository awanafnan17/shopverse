import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes — logged-in users */}
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/order-confirmation/:id" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                {/* Admin routes */}
                <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

                {/* Fallback */}
                <Route path="*" element={
                    <div className="page-wrapper container text-center">
                        <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
                        <p className="text-muted">Page not found</p>
                    </div>
                } />
            </Routes>
            <Footer />
        </>
    );
}

export default App;
