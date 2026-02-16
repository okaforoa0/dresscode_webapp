import { useEffect, useState } from "react";

const TITLE_TEXT = "Getting Started with DressCode";

export default function GettingStarted() {
  const [typedTitle, setTypedTitle] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setTypedTitle(TITLE_TEXT.slice(0, index));
      if (index >= TITLE_TEXT.length) {
        clearInterval(interval);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  const isTypingComplete = typedTitle.length === TITLE_TEXT.length;

  const steps = [
    {
      icon: "Tag",
      title: "1. Tag Your Clothing",
      body: "Attach a small RFID tag to each clothing item you want to track. Each tag has a unique ID that lets DressCode identify your items.",
    },
    {
      icon: "Add",
      title: "2. Add Items to the System",
      body: "In the web app, register each tagged item by entering details like item name, color, and type. This creates your digital closet record.",
    },
    {
      icon: "Scan",
      title: "3. Scan the Item",
      body: "Hold or place the item near the DressCode scanning unit. The RFID reader and sensors detect it instantly.",
    },
    {
      icon: "Sync",
      title: "4. Your Closet Updates",
      body: "After scanning, the item appears in your digital closet as either In Closet or Checked Out depending on status.",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-xl bg-earth-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-8">
        <h1 className="text-center text-3xl font-semibold tracking-tight text-earth-text sm:text-4xl">
          {typedTitle}
          {!isTypingComplete && (
            <span className="ml-1 inline-block h-[1em] w-0.5 animate-pulse align-middle bg-earth-moss" />
          )}
        </h1>
        <h2 className="mt-3 text-center text-lg font-medium text-earth-stone">
          Welcome to DressCode - Your Smart Closet Assistant
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-7 text-earth-stone sm:text-base">
          This guide helps you set up and use your wardrobe management system powered by RFID technology. You will learn how to tag items, scan them with the DressCode unit, and view your updated closet in the web app.
        </p>

        <h2 className="mt-8 text-center text-xl font-semibold text-earth-text">How DressCode Works</h2>

        <p className="mx-auto mt-3 max-w-3xl text-center text-sm leading-7 text-earth-stone sm:text-base">
          DressCode uses RFID tags to automatically track which clothing items are in your closet. Here is a quick overview of the flow.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-xl border border-earth-sand/30 bg-earth-bg p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-earth-moss">{step.icon}</p>
              <h3 className="mt-2 text-lg font-semibold text-earth-text">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-earth-stone">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
