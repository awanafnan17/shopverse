import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import './Products.css';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const activeCategory = searchParams.get('category') || '';
    const searchQuery = searchParams.get('search') || '';
    const sortBy = searchParams.get('sort') || '-createdAt';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await API.get('/categories');
                setCategories(data);

                // If category param is a slug (not an ObjectId), resolve it to the _id
                const catParam = searchParams.get('category');
                if (catParam && !/^[a-f\d]{24}$/i.test(catParam)) {
                    const match = data.find(c =>
                        c.slug === catParam ||
                        c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === catParam
                    );
                    if (match) {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set('category', match._id);
                        setSearchParams(newParams, { replace: true });
                    }
                }
            } catch (err) { console.error(err); }
        };
        fetchCategories();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                params.append('page', page);
                params.append('limit', '12');
                params.append('sort', sortBy);
                if (activeCategory) params.append('category', activeCategory);
                if (searchQuery) params.append('search', searchQuery);
                if (minPrice) params.append('minPrice', minPrice);
                if (maxPrice) params.append('maxPrice', maxPrice);

                const { data } = await API.get(`/products?${params.toString()}`);
                setProducts(data.products || []);
                setTotalPages(data.pages || 1);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchProducts();
    }, [page, activeCategory, searchQuery, sortBy, minPrice, maxPrice]);

    const updateFilter = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) { newParams.set(key, value); } else { newParams.delete(key); }
        newParams.delete('page');
        setPage(1);
        setSearchParams(newParams);
    };

    return (
        <div className="products-page page-wrapper">
            <div className="container">
                <div className="products-layout">
                    {/* Sidebar Filters */}
                    <aside className="products-sidebar">
                        <h3 className="sidebar-title">Filters</h3>

                        <div className="filter-group">
                            <label className="filter-label">Category</label>
                            <select
                                className="form-select"
                                value={activeCategory}
                                onChange={(e) => updateFilter('category', e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Price Range</label>
                            <div className="price-inputs">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    className="form-input"
                                    value={minPrice}
                                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                                />
                                <span>—</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    className="form-input"
                                    value={maxPrice}
                                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Sort By</label>
                            <select
                                className="form-select"
                                value={sortBy}
                                onChange={(e) => updateFilter('sort', e.target.value)}
                            >
                                <option value="-createdAt">Newest First</option>
                                <option value="createdAt">Oldest First</option>
                                <option value="price">Price: Low to High</option>
                                <option value="-price">Price: High to Low</option>
                                <option value="-ratings">Top Rated</option>
                            </select>
                        </div>

                        <button className="btn btn-secondary btn-block" onClick={() => { setSearchParams({}); setPage(1); }}>
                            Clear Filters
                        </button>
                    </aside>

                    {/* Product Grid */}
                    <main className="products-main">
                        <div className="products-header">
                            <h1>{searchQuery ? `Search: "${searchQuery}"` : 'All Products'}</h1>
                            <span className="text-muted">{products.length} products found</span>
                        </div>

                        {loading ? (
                            <Loader />
                        ) : products.length === 0 ? (
                            <div className="empty-state">
                                <h3>No products found</h3>
                                <p>Try adjusting your filters or search query.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-4">
                                    {products.map((p) => (
                                        <ProductCard key={p._id} product={p} />
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className="pagination">
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            disabled={page <= 1}
                                            onClick={() => setPage(page - 1)}
                                        >
                                            Previous
                                        </button>
                                        <span className="page-info">
                                            Page {page} of {totalPages}
                                        </span>
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            disabled={page >= totalPages}
                                            onClick={() => setPage(page + 1)}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Products;
