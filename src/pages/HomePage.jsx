import closetBg from "../assets/closet-bg.jpg";
import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div
            className="home-background"
            style={{ backgroundImage: `url(${closetBg})` }}
        >

        <div className="home-overlay">
            <div className="home-hero">
                <h1 className="page-title"> Welcome to DressCode!</h1>
                <p className="home-tagline">Your personal wardrobe management system.</p>

                <div className="home-accent"></div>

                <p className="home-desc">
                    Track your outfits, manage your wardrobe, and keep everything
                    beautifully organized with DressCode, an RFID powered closet technology.
                </p>

                <Link to="/onboarding">
                    <button className="home-btn">Learn How It Works</button>
                </Link>
            </div>
        </div>
    </div>
    );
}

