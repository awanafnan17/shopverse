import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiGrid } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/products?search=${encodeURIComponent(search.trim())}`);
            setSearch('');
            setMenuOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="container navbar-inner">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">◆</span>
                    <span className="brand-text">ShopVerse</span>
                </Link>

                <form className="navbar-search" onSubmit={handleSearch}>
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                </form>

                <div className={`navbar-actions ${menuOpen ? 'open' : ''}`}>
                    <Link to="/products" className="nav-link" onClick={() => setMenuOpen(false)}>
                        Products
                    </Link>

                    {user ? (
                        <>
                            <Link to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>
                                <FiUser /> {user.name?.split(' ')[0]}
                            </Link>
                            {isAdmin && (
                                <Link to="/admin" className="nav-link nav-admin" onClick={() => setMenuOpen(false)}>
                                    <FiGrid /> Admin
                                </Link>
                            )}
                            <button className="nav-link btn-unstyled" onClick={handleLogout}>
                                <FiLogOut /> Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
                            <FiUser /> Login
                        </Link>
                    )}

                    <Link to="/cart" className="nav-cart" onClick={() => setMenuOpen(false)}>
                        <FiShoppingCart />
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </Link>
                </div>

                <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
