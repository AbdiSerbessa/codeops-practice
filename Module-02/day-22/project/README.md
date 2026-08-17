# Currency Converter App

A modern, light-weight JavaScript web application that converts Ethiopian Birr (ETB) to multiple foreign currencies in real time using live exchange rates.

## Features

- **Live Rates Fetching**: Pulls real-time exchange rate data from the Open Exchange Rates API (`open.er-api.com`).
- **Input Validation**:
  - Requires non-empty numeric inputs (> 0).
  - Upper boundary check (max 100,000,000 ETB).
  - Restricts input precision to a maximum of 4 decimal places.
  - Highlights invalid fields visually with error feedback.
- **Duplicate Protection**: Prevents duplicate consecutive submissions and handles list re-rendering cleanly.
- **LocalStorage Persistence**: Saves conversion history locally in the browser across sessions.
- **Dynamic Country Flags**: Automatically displays target country flag icons alongside conversion results.
- **Responsive UI**: Modern, clean design styled with CSS custom properties and full mobile responsiveness.

## Tech Stack

- **HTML5**: Semantic layout and form controls.
- **CSS3**: Flexbox, CSS variables, custom state animations, and responsive styling.
- **JavaScript (ES6+)**: Async/Await Fetch API, Event Delegation, DOM Manipulation, and `localStorage`.

## Project Structure

```text
├── index.html     # Application structure and form layout
├── styles.css     # UI styling and visual feedback rules
├── app.js         # Core application logic, validation, and API handling
└── README.md      # Project documentation