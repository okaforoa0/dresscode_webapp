import { useEffect, useRef, useState } from "react";
import closetBg from "../assets/closet-bg.jpg";
import { Link } from "react-router-dom";

const HERO_TITLE = "Welcome to DressCode";

function RevealOnScroll({ children, delay = 0 }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transform transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const [typedTitle, setTypedTitle] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setTypedTitle(HERO_TITLE.slice(0, index));

      if (index >= HERO_TITLE.length) {
        clearInterval(interval);
      }
    }, 65);

    return () => clearInterval(interval);
  }, []);

  const isTypingComplete = typedTitle.length === HERO_TITLE.length;

  return (
    <div className="bg-earth-bg">
      <section
        className="relative flex min-h-[calc(100vh-72px)] items-center bg-cover bg-center bg-no-repeat px-4 py-14 sm:px-6 lg:px-8"
        style={{ backgroundImage: `url(${closetBg})` }}
      >
        <div className="absolute inset-0 bg-earth-pine/20" />
        <div className="relative mx-auto w-full max-w-6xl">
          <RevealOnScroll>
            <div className="mx-auto max-w-3xl rounded-2xl bg-earth-card/90 p-6 text-center shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-10">
              <h1 className="text-3xl font-semibold tracking-tight text-earth-text sm:text-5xl">
                {typedTitle}
                {!isTypingComplete && (
                  <span className="ml-1 inline-block h-[1em] w-0.5 animate-pulse align-middle bg-earth-moss" />
                )}
              </h1>
              <p className="mt-4 text-base text-earth-stone sm:text-lg">
                Your personal wardrobe management system.
              </p>
              <div className="mx-auto mt-5 h-1.5 w-20 rounded-full bg-earth-sand" />
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-earth-stone sm:text-base">
                Track your outfits, manage your wardrobe, and keep everything organized
                with DressCode, an RFID-powered closet technology.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/onboarding"
                  className="rounded-xl bg-earth-moss px-5 py-3 text-sm font-semibold text-earth-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-earth-sage hover:shadow-md"
                >
                  Learn How It Works
                </Link>
                <Link
                  to="/closet"
                  className="rounded-xl border border-earth-sand bg-earth-card px-5 py-3 text-sm font-semibold text-earth-text transition-all duration-200 hover:-translate-y-1 hover:bg-earth-bg hover:shadow-md"
                >
                  Enter Closet
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="rounded-xl bg-earth-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-8">
            <h2 className="text-2xl font-semibold text-earth-text">What DressCode Is</h2>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-earth-stone sm:text-base">
              DressCode is a smart closet dashboard that helps you keep track of what you
              own, what is currently checked out, and what is available to wear. It turns
              your wardrobe into a clear, searchable system.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <RevealOnScroll delay={80}>
            <div className="h-full rounded-xl bg-earth-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <p className="text-xs font-semibold uppercase tracking-wide text-earth-moss">
                Visibility
              </p>
              <h3 className="mt-2 text-lg font-semibold text-earth-text">Know What You Own</h3>
              <p className="mt-2 text-sm leading-6 text-earth-stone">
                See your clothing inventory in one place with clear status and category info.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={160}>
            <div className="h-full rounded-xl bg-earth-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <p className="text-xs font-semibold uppercase tracking-wide text-earth-moss">
                Automation
              </p>
              <h3 className="mt-2 text-lg font-semibold text-earth-text">RFID-Powered Updates</h3>
              <p className="mt-2 text-sm leading-6 text-earth-stone">
                Sync item movement with scanning hardware so closet state stays accurate.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={240}>
            <div className="h-full rounded-xl bg-earth-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <p className="text-xs font-semibold uppercase tracking-wide text-earth-moss">
                Simplicity
              </p>
              <h3 className="mt-2 text-lg font-semibold text-earth-text">Fast Daily Workflow</h3>
              <p className="mt-2 text-sm leading-6 text-earth-stone">
                Add items quickly, track usage, and find outfit options without clutter.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="border-y border-earth-sand/40 bg-earth-card/60 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-2">
          <RevealOnScroll>
            <div className="rounded-xl bg-earth-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <h2 className="text-2xl font-semibold text-earth-text">How It Helps</h2>
              <ul className="mt-4 space-y-3 text-sm text-earth-stone sm:text-base">
                <li>- Reduces duplicate purchases by keeping inventory visible.</li>
                <li>- Makes outfit planning faster with real-time closet status.</li>
                <li>- Helps teams and households share wardrobe information clearly.</li>
              </ul>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={120}>
            <div className="rounded-xl bg-earth-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <h2 className="text-2xl font-semibold text-earth-text">Get Started</h2>
              <p className="mt-4 text-sm leading-7 text-earth-stone sm:text-base">
                Start by tagging clothing items, then register them in the app. From there,
                scans automatically reflect each item as in closet or checked out.
              </p>
              <Link
                to="/onboarding"
                className="mt-6 inline-flex rounded-xl bg-earth-moss px-5 py-3 text-sm font-semibold text-earth-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-earth-sage hover:shadow-md"
              >
                View Setup Guide
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
