import closetBg from "../assets/closet-bg.jpg";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div
      className="relative flex min-h-[calc(100vh-72px)] items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-10 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${closetBg})` }}
    >
      <div className="absolute inset-0 bg-earth-pine/35" />

      <div className="relative w-full max-w-6xl">
        <div className="mx-auto max-w-3xl rounded-2xl bg-earth-card/90 p-6 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-10">
          <h1 className="text-center text-3xl font-semibold tracking-tight text-earth-text sm:text-4xl">
            Welcome to DressCode
          </h1>

          <p className="mt-3 text-center text-base text-earth-stone sm:text-lg">
            Your personal wardrobe management system.
          </p>

          <div className="mx-auto mt-5 h-1.5 w-20 rounded-full bg-earth-sand" />

          <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-7 text-earth-stone sm:text-base">
            Track your outfits, manage your wardrobe, and keep everything organized with
            DressCode, an RFID-powered closet technology.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              to="/onboarding"
              className="rounded-xl bg-earth-moss px-5 py-3 text-sm font-semibold text-earth-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-earth-sage hover:shadow-md"
            >
              Learn How It Works
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
