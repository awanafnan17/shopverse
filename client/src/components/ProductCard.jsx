import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.stock <= 0) {
            toast.error('Product is out of stock');
            return;
        }
        addToCart(product, 1);
        toast.success(`${product.name} added to cart`);
    };

    const imageUrl = product.images?.[0]
        ? (product.images[0].startsWith('http') ? product.images[0] : `http://localhost:5000${product.images[0]}`)
        : `https://placehold.co/400x400/1a1a2e/6c63ff?text=${encodeURIComponent(product.name?.slice(0, 12) || 'Product')}`;

    return (
        <Link to={`/products/${product._id}`} className="product-card card">
            <div className="product-image-wrapper">
                <img src={imageUrl} alt={product.name} className="product-image" loading="lazy" />
                {product.featured && <span className="product-featured-badge">Featured</span>}
                {product.stock <= 0 && <span className="product-oos-badge">Out of Stock</span>}
            </div>

            <div className="product-info">
                <p className="product-category">{product.category?.name || 'General'}</p>
                <h3 className="product-name">{product.name}</h3>

                <div className="product-meta">
                    <div className="product-rating">
                        <FiStar className="star-icon" />
                        <span>{product.ratings?.toFixed(1) || '0.0'}</span>
                        <span className="text-muted">({product.numReviews || 0})</span>
                    </div>
                    <span className="product-price">${product.price?.toFixed(2)}</span>
                </div>

                <button
                    className="btn btn-primary btn-sm btn-block product-add-btn"
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                >
                    <FiShoppingCart /> {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                </button>
            </div>
        </Link>
    );
};

export default ProductCard;
