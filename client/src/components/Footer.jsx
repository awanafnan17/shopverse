import { Link } from 'react-router-dom';
import { FiGithub, FiMail, FiShield } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col">
                        <h3 className="footer-brand">
                            <span className="brand-icon">◆</span> ShopVerse
                        </h3>
                        <p className="footer-desc">
                            Your premium online shopping destination. Quality products, secure payments, fast delivery.
                        </p>
                    </div>

                    <div className="footer-col">
                        <h4 className="footer-heading">Quick Links</h4>
                        <Link to="/products" className="footer-link">All Products</Link>
                        <Link to="/cart" className="footer-link">Shopping Cart</Link>
                        <Link to="/profile" className="footer-link">My Account</Link>
                    </div>

                    <div className="footer-col">
                        <h4 className="footer-heading">Categories</h4>
                        <Link to="/products?category=electronics" className="footer-link">Electronics</Link>
                        <Link to="/products?category=clothing" className="footer-link">Clothing</Link>
                        <Link to="/products?category=home-kitchen" className="footer-link">Home & Kitchen</Link>
                    </div>

                    <div className="footer-col">
                        <h4 className="footer-heading">Security</h4>
                        <p className="footer-security">
                            <FiShield /> All payments are encrypted and processed through trusted gateways.
                        </p>
                        <p className="footer-security">
                            <FiMail /> support@shopverse.com
                        </p>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} ShopVerse. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <a href="#" className="footer-link">Privacy Policy</a>
                        <a href="#" className="footer-link">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
