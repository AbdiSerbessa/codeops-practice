# AddisEats — Food Ordering Web Application

A lightweight, responsive single-page food ordering web application built using standard modern web technologies. The app dynamically fetches menu items from a localized JSON dataset, features real-time search and category filtering, manages cart state with live total price calculation, and enforces client-side form validation for delivery details.

---

## Features

* **Dynamic Data Fetching**: Asynchronously loads food menu items from a local `menu.json` payload using the JavaScript `fetch()` API.
* **Interactive Cart State**: Real-time item additions, quantity updates, removal handling, and automatic total price calculations.
* **Search & Category Filtering**: Instant client-side text searching combined with category pills (*Traditional*, *Fast Food*, *Vegetarian*, *Drinks*).
* **Delivery Form Validation**: Enforces input constraints prior to order placement:
  * **Full Name**: Minimum of 3 characters.
  * **Phone Number**: Ethiopian mobile regex validation (`09...` or `07...` format, 10 digits).
  * **Address**: Minimum of 5 characters.
* **Responsive Layout**: Designed with CSS Grid and Flexbox for desktop, tablet, and mobile viewports.

---

## Tech Stack

* **Frontend**: HTML5, CSS3
* **Scripting**: Modern JavaScript (ES6+)
* **Data Source**: JSON (`data/menu.json`)

---

## Project Structure

```text
addiseats/
├── data/
│   └── menu.json         # Food item data array
├── index.html            # Main markup template
├── styles.css            # Component styles & layout rules
├── app.js                # Application state, DOM rendering, & validations
└── README.md             # Project documentation