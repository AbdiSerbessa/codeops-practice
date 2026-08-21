# AddisEats — Food Ordering Web Application

A lightweight, responsive single-page food ordering web application built using modern Vanilla JavaScript, HTML5, and CSS3. The application dynamically fetches menu items from a localized JSON dataset, manages real-time UI state, persists shopping cart data across browser sessions, and enforces client-side form validation for delivery details.

---

## Features

* **Dynamic Data Fetching**: Asynchronously loads food menu items from a local `menu.json` payload using the JavaScript `fetch()` API.
* **Persistent Cart State**: Real-time item additions, quantity updates, removal handling, and live total price calculations backed by `localStorage` persistence across page reloads.
* **Search & Category Filtering**: Instant client-side text search combined with category filtering (*Main*, *Vegetarian*, *Drinks*).
* **Delivery Form Validation**: Enforces input constraints prior to order placement:
  * **Full Name**: Minimum length check (3+ characters).
  * **Phone Number**: Regex validation enforcing valid 10-digit Ethiopian mobile formats (`09...` or `07...`).
  * **Address**: Minimum length check (5+ characters).
* **Responsive Layout**: Fluid design built using CSS Grid and Flexbox for mobile, tablet, and desktop viewports.

---

## Tech Stack

* **Frontend**: HTML5, CSS3
* **Scripting**: Modern JavaScript (ES6+)
* **Storage**: Browser `localStorage` API
* **Data Source**: JSON (`data/menu.json`)

---

## Project Structure

```text
addiseats/
├── data/
│   └── menu.json         # Food item data array
├── index.html            # Single page application markup
├── styles.css            # Custom layout rules & responsive styles
├── app.js                # State management, DOM rendering, & form validation
└── README.md             # Project documentation