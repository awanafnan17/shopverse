import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUserPlus, FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const passwordRules = [
    { label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { label: 'An uppercase letter (A-Z)', test: (p) => /[A-Z]/.test(p) },
    { label: 'A lowercase letter (a-z)', test: (p) => /[a-z]/.test(p) },
    { label: 'A digit (0-9)', test: (p) => /[0-9]/.test(p) },
    { label: 'A special character (!@#$...)', test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(p) },
];

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [showRules, setShowRules] = useState(false);

    const ruleResults = useMemo(() =>
        passwordRules.map((r) => ({ ...r, passed: r.test(form.password) })),
        [form.password]
    );

    const allPassed = ruleResults.every((r) => r.passed);
    const strength = ruleResults.filter((r) => r.passed).length;
    const strengthLabel = strength <= 1 ? 'Weak' : strength <= 3 ? 'Fair' : strength <= 4 ? 'Good' : 'Strong';
    const strengthColor = strength <= 1 ? '#ef4444' : strength <= 3 ? '#f59e0b' : strength <= 4 ? '#3b82f6' : '#22c55e';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!allPassed) {
            return toast.error('Password does not meet the requirements');
        }
        if (form.password !== form.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        setLoading(true);
        try {
            await register(form.name, form.email, form.password);
            toast.success('Account created successfully!');
            navigate('/');
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Registration failed';
            toast.error(`Error: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page page-wrapper">
            <div className="auth-card card-glass animate-fade-in">
                <div className="auth-header">
                    <span className="brand-icon" style={{ fontSize: 32 }}>◆</span>
                    <h1>Create Account</h1>
                    <p className="text-muted">Join ShopVerse today</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Strong password required"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            onFocus={() => setShowRules(true)}
                            required
                        />
                        {showRules && form.password.length > 0 && (
                            <div className="pw-strength-box">
                                <div className="pw-strength-bar-track">
                                    <div
                                        className="pw-strength-bar-fill"
                                        style={{ width: `${(strength / 5) * 100}%`, background: strengthColor }}
                                    />
                                </div>
                                <span className="pw-strength-label" style={{ color: strengthColor }}>
                                    {strengthLabel}
                                </span>
                                <ul className="pw-rules">
                                    {ruleResults.map((r, i) => (
                                        <li key={i} className={r.passed ? 'passed' : 'failed'}>
                                            {r.passed ? <FiCheck /> : <FiX />} {r.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Re-enter password"
                            value={form.confirmPassword}
                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                            required
                        />
                    </div>
                    <button className="btn btn-primary btn-lg btn-block" disabled={loading || !allPassed}>
                        <FiUserPlus /> {loading ? 'Creating...' : 'Create Account'}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
