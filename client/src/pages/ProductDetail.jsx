import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import Loader from '../components/Loader';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const [prodRes, revRes] = await Promise.all([
                    API.get(`/products/${id}`),
                    API.get(`/reviews/${id}`),
                ]);
                setProduct(prodRes.data);
                setReviews(revRes.data);
            } catch (err) {
                toast.error('Product not found');
                navigate('/products');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product.stock <= 0) return toast.error('Product is out of stock');
        addToCart(product, quantity);
        toast.success(`${product.name} added to cart`);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) return toast.error('Please login to leave a review');
        setSubmitting(true);
        try {
            const { data } = await API.post('/reviews', {
                productId: id,
                rating: reviewForm.rating,
                comment: reviewForm.comment,
            });
            setReviews([data, ...reviews]);
            setReviewForm({ rating: 5, comment: '' });
            toast.success('Review submitted');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error submitting review');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader />;
    if (!product) return null;

    const imageUrl = product.images?.[0]
        ? (product.images[0].startsWith('http') ? product.images[0] : `http://localhost:5000${product.images[0]}`)
        : `https://placehold.co/600x600/1a1a2e/6c63ff?text=${encodeURIComponent(product.name?.slice(0, 15))}`;

    return (
        <div className="product-detail page-wrapper">
            <div className="container">
                <button className="btn btn-secondary btn-sm mb-6" onClick={() => navigate(-1)}>
                    <FiArrowLeft /> Back
                </button>

                <div className="pd-grid">
                    <div className="pd-images">
                        <img src={imageUrl} alt={product.name} className="pd-main-image" />
                    </div>

                    <div className="pd-info">
                        <span className="pd-category">{product.category?.name || 'General'}</span>
                        <h1 className="pd-name">{product.name}</h1>

                        <div className="pd-rating">
                            <StarRating rating={Math.round(product.ratings || 0)} />
                            <span>{product.ratings?.toFixed(1)} ({product.numReviews} reviews)</span>
                        </div>

                        <p className="pd-price">${product.price?.toFixed(2)}</p>

                        <p className="pd-description">{product.description}</p>

                        <div className="pd-stock">
                            <span className={product.stock > 0 ? 'badge badge-success' : 'badge badge-danger'}>
                                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                            </span>
                        </div>

                        {product.variants?.length > 0 && (
                            <div className="pd-variants">
                                {product.variants.map((v, i) => (
                                    <div key={i} className="variant-group">
                                        <label className="form-label">{v.name}</label>
                                        <select className="form-select">
                                            {v.options?.map((opt) => <option key={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="pd-actions">
                            <div className="quantity-control">
                                <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                    <FiMinus />
                                </button>
                                <span className="qty-value">{quantity}</span>
                                <button className="qty-btn" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>
                                    <FiPlus />
                                </button>
                            </div>
                            <button className="btn btn-primary btn-lg" onClick={handleAddToCart} disabled={product.stock <= 0}>
                                <FiShoppingCart /> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <section className="pd-reviews mt-8">
                    <h2>Customer Reviews ({reviews.length})</h2>

                    {user && (
                        <form className="review-form card p-6 mt-4 mb-6" onSubmit={handleReviewSubmit}>
                            <h3>Write a Review</h3>
                            <div className="form-group">
                                <label className="form-label">Rating</label>
                                <select
                                    className="form-select"
                                    value={reviewForm.rating}
                                    onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                                >
                                    {[5, 4, 3, 2, 1].map((r) => (
                                        <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Comment</label>
                                <textarea
                                    className="form-input"
                                    rows={3}
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                    required
                                />
                            </div>
                            <button className="btn btn-primary" disabled={submitting}>
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    )}

                    <div className="reviews-list">
                        {reviews.length === 0 ? (
                            <p className="text-muted">No reviews yet. Be the first to review!</p>
                        ) : (
                            reviews.map((rev) => (
                                <div key={rev._id} className="review-item card p-4 mb-4">
                                    <div className="review-header">
                                        <strong>{rev.user?.name || 'Anonymous'}</strong>
                                        <StarRating rating={rev.rating} size={14} />
                                    </div>
                                    <p className="review-comment">{rev.comment}</p>
                                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                                        {new Date(rev.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProductDetail;
