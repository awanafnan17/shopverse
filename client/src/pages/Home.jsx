import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiShield, FiCreditCard, FiHeadphones } from 'react-icons/fi';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import './Home.css';

const Home = () => {
    const [featured, setFeatured] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    API.get('/products?featured=true&limit=8'),
                    API.get('/categories'),
                ]);
                setFeatured(prodRes.data.products || []);
                setCategories(catRes.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Loader text="Loading store..." />;

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="container hero-inner">
                    <div className="hero-content animate-fade-in">
                        <span className="hero-tag">Welcome to ShopVerse</span>
                        <h1 className="hero-title">
                            Discover <span className="text-gradient">Premium</span> Products
                        </h1>
                        <p className="hero-subtitle">
                            Shop the latest electronics, fashion, and home essentials with secure payments and fast delivery.
                        </p>
                        <div className="hero-actions">
                            <Link to="/products" className="btn btn-primary btn-lg">
                                Shop Now <FiArrowRight />
                            </Link>
                            <Link to="/products?featured=true" className="btn btn-secondary btn-lg">
                                Featured Items
                            </Link>
                        </div>
                    </div>
                    <div className="hero-visual animate-fade-in">
                        <div className="hero-glow" />
                        <div className="hero-shapes">
                            <div className="shape shape-1" />
                            <div className="shape shape-2" />
                            <div className="shape shape-3" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Strip */}
            <section className="features-strip">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-item">
                            <FiTruck className="feature-icon" />
                            <div>
                                <h4>Free Shipping</h4>
                                <p>On orders over $50</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <FiShield className="feature-icon" />
                            <div>
                                <h4>Secure Payments</h4>
                                <p>SSL encrypted checkout</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <FiCreditCard className="feature-icon" />
                            <div>
                                <h4>Dual Payment</h4>
                                <p>Stripe & Cash on Delivery</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <FiHeadphones className="feature-icon" />
                            <div>
                                <h4>24/7 Support</h4>
                                <p>Dedicated help centre</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            {categories.length > 0 && (
                <section className="section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Shop by Category</h2>
                            <Link to="/products" className="section-link">View All <FiArrowRight /></Link>
                        </div>
                        <div className="categories-grid">
                            {categories.map((cat) => (
                                <Link to={`/products?category=${cat._id}`} key={cat._id} className="category-card card-glass">
                                    <span className="category-icon">◆</span>
                                    <h3>{cat.name}</h3>
                                    <p>{cat.description}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Products */}
            {featured.length > 0 && (
                <section className="section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Featured Products</h2>
                            <Link to="/products?featured=true" className="section-link">View All <FiArrowRight /></Link>
                        </div>
                        <div className="grid grid-4">
                            {featured.map((p) => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="cta-section">
                <div className="container text-center">
                    <h2 className="cta-title">Ready to Start Shopping?</h2>
                    <p className="cta-desc">Join thousands of happy customers. Create your account today.</p>
                    <Link to="/register" className="btn btn-primary btn-lg">
                        Create Account <FiArrowRight />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
