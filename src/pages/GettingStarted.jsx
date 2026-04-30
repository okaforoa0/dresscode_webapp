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
      icon: "Sign In",
      title: "1. Create an Account and Sign In",
      body: "Create your DressCode account and sign in first. Your closet, devices, and outfit history are tied to your user account, so this step comes before anything else.",
    },
    {
      icon: "Device",
      title: "2. Register Your DressCode Unit",
      body: "Go to the Closet page, click Register Device, then enter the device ID shown on the unit LCD after tapping the pairing card. Once saved, that device is linked to your account.",
    },
    {
      icon: "Tag",
      title: "3. Tag Your Clothing",
      body: "Attach an RFID tag to each clothing item you want to track. Each tag has a unique ID so DressCode can recognize that specific item later.",
    },
    {
      icon: "Start",
      title: "4. Start Registration Mode",
      body: "On the Closet page, choose your device and click Start Registration. The app will begin polling the backend and wait for a new RFID tag to be scanned.",
    },
    {
      icon: "Scan",
      title: "5. Scan the RFID Tag",
      body: "Hold the tagged clothing item near the DressCode unit. When the scan is detected, the tag appears in the app as a pending RFID ready to be connected to a clothing item.",
    },
    {
      icon: "Add",
      title: "6. Add Item Details",
      body: "After the RFID is captured, enter the item name, color, type, and optional clothing photo. Then click Add Item to save it to your digital closet.",
    },
    {
      icon: "Track",
      title: "7. Track Wear and Closet Activity",
      body: "From that point on, future scans check items in and out automatically. Outfit Suggestions and Closet Wrapped use that scan history to power recommendations and wear insights.",
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
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-xl border border-earth-sand/30 bg-earth-bg p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-earth-moss">{step.icon}</p>
                <span className="rounded-full bg-earth-card px-3 py-1 text-xs font-semibold text-earth-moss">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="mt-2 text-lg font-semibold text-earth-text">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-earth-stone">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
