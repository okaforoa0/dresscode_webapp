export default function GettingStarted() {
    return (
        <div>
            {/* HOW DRESSCODE WORKS SECTION */}
            <section className="gs-section fade-up">
                <h1 className="page-title">Getting Started with DressCode</h1>
                <h2 className="getting-started-h2"> Welcome to DressCode — Your Smart Closet Assistant! </h2>

            
                <p className="gs-section-subtext">
                    This guide will help you set up and start using your personal wardrobe management system powered by RFID technology.
                    You'll learn how to tag your items, scan them with the DressCode unit, and view your updated closet right from the web app.
                </p>
                
                <h2 className="getting-started-h2"> How DressCode Works </h2>

                <p className="gs-section-subtext">
                    DressCode uses RFID tags to automatically track which clothing items are in your closet. Here's a quick overview of how the system works:
                </p>

                <div className="gs-steps">

                    {/* STEP 1 */}
                    <div className="gs-step-card fade-up">
                        <span className="gs-step-icon">🏷️</span>
                        <h3>1. Tag Your Clothing</h3>
                        <p>
                            Attach a small RFID tag to each clothing item you want to track.
                            Each tag has a unique ID, allowing DressCode to identify your items.
                        </p>
                    </div>

                    {/* STEP 2 */}
                    <div className="gs-step-card fade-up">
                        <span className="gs-step-icon">➕</span>
                        <h3>2. Add Items to the System</h3>
                        <p>
                            In the web app, register each tagged item by entering its details
                            (e.g., item name, color, type). This creates a record for the item in your digital closet.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="gs-step-card fade-up" style={{ animationDelay: "0.1s" }}>
                        <span className="gs-step-icon">📡</span>
                        <h3>3. Scan the Item</h3>
                        <p>
                            Hold or place the item near the DressCode scanning unit. The RFID reader and sensors detect it instantly.
                        </p>
                    </div>

                    {/* Step 4 */}
                    <div className="gs-step-card fade-up" style={{ animationDelay: "0.2s" }}>
                        <span className="gs-step-icon">🧺</span>
                        <h3>4. Your Closet Updates</h3>
                        <p>
                            Once scanned, the item appears in your digital closet as either
                            “In Closet” or “Checked Out,” depending on its status.
                        </p>
                    </div>

                </div>
            </section>

        </div>
    );
}
                    
        
        
