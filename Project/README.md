**Mesob House**: Immersive Heritage Dining & Digital Hospitality Experience

Authentic Ethiopian & Eritrean Heritage Dining, Communal Feasting, and Digital Hospitality Platform.

**🌟 Executive Overview**

Mesob House is a web-based immersive restaurant and cultural dining platform designed to replicate the warm, communal spirit of sharing a traditional Mesob. It blends rich Ethiopian culinary heritage with modern e-commerce capabilities, offering guests a frictionless way to explore ancestral spice blends, customize stews with custom heat levels and teff bases, manage a communal feast basket, and complete secure simulated checkouts.

**🚀 Key Features & Capabilities**

🍲 Immersive Heritage Menu & Specials: Dynamic category filtering for Traditional Stews & Wat, Tibs & Grills, Raw & Cured Delicacies (Kitfo), Fasting / Tsom (Vegan), and Beverages & Tej.

🌶️ Interactive Dish Customization: Each dish detail view offers precise culinary options including heat levels (Mild, Traditional, Fiery Awaze), Injera base choices (Standard Mixed, 100% Pure Teff), and traditional accompaniments (Fresh Ayib).

🧺 Communal Feasting Cart & Ledger: Real-time cart calculations with dynamic item quantities, subtotal taxation, delivery tier checks, and traditional dining etiquette add-ons (such as the Traditional Handwash Basin).

🔔 Global Toast Notifications: Floating notifications positioned neatly in the top-right viewport whenever guests add items to their table or basket.

☕ Companion Quick-Actions ("Spirit of Gursha"): Direct store dispatch actions from the homepage sidebar for beverages (Golden Tej, Highland Shai) and extra sides (Teff Injera Rolls) with event propagation isolation.

👤 Guest Authentication & Rewards: Simulated user login, profile registration, and membership status tracking for Mesob House regulars.

**🏗️ Project Architecture**

The application is structured as a single-page application (SPA) powered by React Router v6, with global state management handled via lightweight Zustand stores.

src/
├── assets/          # Cultural imagery, icons, and hero photography
├── components/
│   ├── cards/       # Dish cards, special cards, and companion widgets
│   ├── common/      # Protected routes, error boundaries, and shared UI
│   └── layout/      # Header, Footer, and navigation wrappers
├── data/            # Static JSON datasets (menu.json, specials.json, featuredDish.json)
├── pages/
│   ├── Auth/        # Login and Register views
│   ├── Cart/        # Basket ledger, etiquette options, and review states
│   ├── Checkout/    # Multi-step delivery and payment processing
│   ├── Confirmation/# Order success and summary state
│   ├── DishDetail/  # Deep-dive view with multi-property fallback lookups & customization
│   ├── Home/        # Hero centerpiece, curated chef specials, and hospitality banner
│   ├── Menu/        # Full catalog explorer with category filtering and search
│   └── NotFound/    # Custom Ethiopian-themed 404 fallback page
├── schemas/         # Form validation and data schemas
├── store/           # Zustand state stores (useCartStore, useAuthStore)
├── styles/          # Global variables and CSS module definitions
├── App.jsx          # Explicit router configuration (/dish/:slug, /menu/:slug, etc.)
└── main.jsx         # Application entry point


**🛠️ Technology Stack**

Frontend Framework: React 18 (Functional components, Hooks)

Build Tool: Vite (Ultra-fast HMR and optimized asset bundling)

Routing: React Router DOM (v6 with explicit parameter matching for slugs and IDs)

State Management: Zustand (Immutable, hook-based global store for cart and user state)

Styling: Modular CSS, CSS Variables, and responsive flexbox/grid layouts

Data Persistence: LocalStorage synchronization for cart items and session states

**📊 Data Flow & State Management**

Dataset Ingestion: Static JSON files (menu.json, specials.json) are imported into feature pages. Robust array verification handlers (Array.isArray() checks with fallback extraction) prevent iterator crashes.

Dynamic Resolution: The DishDetail component normalizes URL search parameters (slug or id) against combined datasets (allDishes = [...menuItems, ...specialsItems]) to render specific culinary descriptions dynamically.

Cart Operations: When a guest clicks an "Add to Table" or companion button, the action dispatches through useCartStore. Sanitization helpers guarantee correct numeric pricing (priceETB, price, unitPrice), preventing NaN evaluation errors in the Cart ledger.

Navigation Protection: Standardized e.stopPropagation() handlers isolate card-level interactive buttons from parent <Link> containers, ensuring seamless routing without accidental page redirects.

**📦 Setup & Installation Instructions**

Follow these steps to run the project locally on your machine:

1. Prerequisites

Ensure you have Node.js (v16+ recommended) and npm installed.

2. Clone the Repository

git clone https://github.com/your-username/mesob-house.git
cd mesob-house


3. Install Dependencies

npm install


4. Run the Development Server

npm run dev


5. Open in Browser

Vite will output a local development URL (typically http://localhost:5173). Open this link in your browser to experience Mesob House.

**Getting Started & Local Setup**

1. **Clone the Repository**
   ```bash
 https://github.com/AbdiSerbessa/codeops-practice/Project
   cd Project
