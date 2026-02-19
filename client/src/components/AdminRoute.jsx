import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, isAdmin, loading } = useAuth();

    if (loading) {
        return <div className="page-wrapper container text-center"><div className="skeleton" style={{ height: 200, width: '100%' }} /></div>;
    }

    if (!user || !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
