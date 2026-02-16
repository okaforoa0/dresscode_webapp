export default function GettingStarted() {
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
      <div className="rounded-xl bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-8">
        <h1 className="text-center text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Getting Started with DressCode
        </h1>
        <h2 className="mt-3 text-center text-lg font-medium text-gray-700">
          Welcome to DressCode - Your Smart Closet Assistant
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-7 text-gray-600 sm:text-base">
          This guide helps you set up and use your wardrobe management system powered by RFID technology. You will learn how to tag items, scan them with the DressCode unit, and view your updated closet in the web app.
        </p>

        <h2 className="mt-8 text-center text-xl font-semibold text-gray-900">How DressCode Works</h2>

        <p className="mx-auto mt-3 max-w-3xl text-center text-sm leading-7 text-gray-600 sm:text-base">
          DressCode uses RFID tags to automatically track which clothing items are in your closet. Here is a quick overview of the flow.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{step.icon}</p>
              <h3 className="mt-2 text-lg font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}