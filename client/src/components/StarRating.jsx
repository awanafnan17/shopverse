import { FiStar } from 'react-icons/fi';

const StarRating = ({ rating, size = 16 }) => {
    return (
        <div style={{ display: 'flex', gap: 2 }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                    key={star}
                    size={size}
                    style={{
                        color: star <= rating ? '#f59e0b' : '#3a3a52',
                        fill: star <= rating ? '#f59e0b' : 'none',
                    }}
                />
            ))}
        </div>
    );
};

export default StarRating;
