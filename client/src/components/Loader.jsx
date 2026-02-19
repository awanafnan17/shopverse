import './Loader.css';

const Loader = ({ text = 'Loading...' }) => {
    return (
        <div className="loader-wrapper">
            <div className="loader-spinner" />
            <p className="loader-text">{text}</p>
        </div>
    );
};

export default Loader;
