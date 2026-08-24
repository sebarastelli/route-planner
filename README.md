# Route Planner

Web application for managing customer locations and planning delivery or sales routes.

The project allows users to add addresses manually or import multiple customers from a CSV file, geocode their locations, and visualize them on an interactive map.

## Features

- Add addresses manually
- Geocode addresses using Nominatim
- Display locations on an interactive map
- Automatically adjust the map to the available locations
- Remove locations
- Import multiple customers from CSV
- Show customer information in map markers

## Tech Stack

- **Next.js**
- **React**
- **TypeScript**
- **React Leaflet**
- **OpenStreetMap**
- **Nominatim**
- **Papa Parse**
- **Tailwind CSS**

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/route-planner.git
cd route-planner
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## CSV Format

The CSV file should contain the following columns:

```csv
cliente,direccion
Juan Perez,"San Martin 1250, Concordia, Entre Rios"
Carlos Gomez,"Urquiza 800, Concordia, Entre Rios"
Pedro Lopez,"Entre Rios 500, Concordia, Entre Rios"
```

## Project Status

🚧 **Work in progress**

The current version focuses on address management, geocoding, CSV import, and map visualization.

### Roadmap

- [ ] Route generation
- [ ] Distance calculation
- [ ] Estimated travel time
- [ ] Route optimization
- [ ] Persistent storage
- [ ] Improved CSV validation
- [ ] Production deployment

## Purpose

This project is being developed as a practical route planning tool for salespeople and delivery drivers who need to organize multiple customer visits efficiently.

---

Built with Next.js, React and TypeScript.
