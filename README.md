Hosted site:https://disasterpwa.vercel.app/
# Peak Protocol

Peak Protocol is a mobile-first disaster response and travel safety platform for Nepal. It combines live hazard awareness, route safety guidance, shelter discovery, and emergency reporting into a single Progressive Web App (PWA) designed for low-connectivity environments.
The app helps users:

- monitor disaster conditions and hazard reports
- view red-zone geofences and safe shelter information
- plan safer routes in emergency or tourism mode
- submit reports and SOS incidents even when offline
- access critical information quickly from a mobile device

## Live Demo

This project is configured for deployment on Vercel and is intended to run as a production-ready frontend with a Supabase backend.
## Overview

Peak Protocol is built with React, Vite, Tailwind CSS, Leaflet, and Supabase. It is designed for Nepal’s context, where tourism safety, landslide risk, flooding, road hazards, and emergency coordination need to be accessible in a clear, mobile-friendly format.

The interface supports two primary modes:

- Emergency / disaster response mode
- Tourism / travel safety mode
## Key Features

- Live disaster map with hazard overlays and geofence alerts
- Real-time feed support using public data sources and Supabase records
- Red-zone detection and geofencing for unsafe areas
- Safe shelter directory with district, capacity, and contact details
- Route planning assistance and safer travel recommendations
- Offline queueing for hazard reports and SOS events using IndexedDB
- PWA installability and offline access for emergency use cases
- Multi-language-ready UI structure with translation support
- AI-assisted hazard reporting flow with location awareness
## Tech Stack

- React 18
- Vite 5
- Tailwind CSS 3
- Leaflet + React Leaflet
- Supabase JS client
- IndexedDB for offline storage
- Vite PWA plugin
- Lucide React icons
## Project Structure

```text
.
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── postcss.config.js
├── tailwind.config.js
├── .env.example
├── public/
│   └── static assets and PWA files
├── scripts/
│   ├── calculate_safe_route.py
│   ├── monitor_hazards.py
│   ├── process_redzones.py
│   └── requirements.txt
├── src/
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── i18n/
│   └── services/
├── supabase/
│   └── schema.sql
├── README.md
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm or yarn
- A Supabase project (recommended for production data)
### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

The app usually runs at:

```text
http://localhost:5173
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Environment Configuration

Create a `.env` file in the project root to configure your app runtime and backend credentials:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id
GEMINI_API_KEY=your_gemini_api_key
```

An example template is already included in `.env.example`.

## Backend Database (Supabase)

This project includes a Supabase schema in `supabase/schema.sql` for:

- `system_status`
- `hazard_reports`
- `red_zones`
- `district_impacts`
- `hazard_vectors`
- `sos_pings`
- `safe_shelters`

### Set up the database

1. Create a new Supabase project in the Supabase dashboard.
2. Open the SQL editor and run the contents of `supabase/schema.sql`.
3. Copy your project URL and anon/service role keys into `.env`.
4. In Vercel, add the same environment variables under Project > Settings > Environment Variables.

Recommended variables for deployment:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

If values are missing, the app can fall back to built-in default project values, but production deployments should use your own Supabase project.

## Vercel Deployment

The project includes a `vercel.json` config to support SPA routing and make frontend routes work correctly in Vercel.

Typical deployment steps:

```bash
npm install
npm run build
vercel --prod
```

Set the same environment variables in your Vercel project settings before deployment.

## Offline Data and Persistence

This app is designed to work offline-first.

- Hazard reports and SOS incidents are queued locally in IndexedDB when the network is unavailable.
- Data remains available after page reload on the same browser/device until the queued records are synced.
- When the app reconnects to the internet, the queued items are retried and sent to Supabase.

This means local emergency data is resilient even during temporary connection loss, while the backend remains the source of truth once synchronization succeeds.

## PWA Notes

This project is configured with the Vite PWA plugin, enabling:

- installable mobile app experience
- offline caching for route and map assets
- better resilience for emergency and field response scenarios

## Scripts and Data Pipeline

The Python scripts under the `scripts/` folder support the operational side of the platform:

- `calculate_safe_route.py` for route safety logic
- `monitor_hazards.py` for hazard monitoring automation
- `process_redzones.py` for red-zone processing and geospatial filtering

These can be extended or connected to external monitoring and backend pipelines.

## Use Cases

- disaster response coordination
- flood and landslide awareness
- tourism route safety for travelers
- emergency shelter discovery
- mobile-first reporting in low-connectivity environments

## License

This project is currently intended for local development and demonstration use unless a separate license is added by the repository owner.

## Credits

- Peak Protocol
- National Disaster Risk Reduction and Management Authority (NDRRMA)
- Department of Hydrology and Meteorology (DHM)
- BIPAD and related disaster information infrastructure
- Nepal Army and local emergency response ecosystem references

## Notes

This app is intended as a resilient emergency-response and travel-safety platform for Nepal. It includes realistic sample data and live API integrations designed for demonstration and operational prototyping.
# Peak Protocol

Peak Protocol is a dual-mode Progressive Web App for Nepal that combines travel safety, disaster monitoring, and emergency response in one mobile-first dashboard.

The app helps users:
- monitor live disaster situations and hazard reports
- view red-zone geofences and safe shelter locations
- plan safer routes in emergency or travel mode
- report hazards and receive alerts in near-real time
- operate as an offline-friendly PWA when connectivity is limited

## Overview

This project is built with React, Vite, Tailwind CSS, Leaflet, and Supabase. It is designed for Nepal’s context, where tourism safety, road risk, flood alerts, landslides, and emergency response data need to be accessible quickly from a mobile device.

The UI supports two modes:
- Emergency / disaster response mode
- Tourism / travel safety mode

## Key Features

- Live disaster map with hazard overlays and geofence alerts
- Real-time feed support using external public APIs plus Supabase data
- Red zone detection and geofencing for dangerous areas
- Safe shelter directory with district, capacity, and contact information
- Route planning assistance and safety-informed travel guidance
- Offline queueing for reports and SOS events using IndexedDB
- PWA support for installability and offline access
- Multi-language-ready UI structure with translation support
- AI-assisted hazard reporting flow with image and location awareness

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS 3
- Leaflet + React Leaflet
- Supabase JS client
- IndexedDB for offline storage
- Vite PWA plugin
- Lucide React icons

## Project Structure

```text
.
├── index.html
├── package.json
├── vite.config.js
├── postcss.config.js
├── tailwind.config.js
├── public/
│   └── ... static assets and PWA icons
├── scripts/
│   ├── calculate_safe_route.py
│   ├── monitor_hazards.py
│   ├── process_redzones.py
│   └── requirements.txt
├── src/
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── i18n/
│   └── services/
├── supabase/
│   └── schema.sql
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm or yarn

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

The app should be available in the default Vite dev server URL, usually:

```text
http://localhost:5173
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Environment Configuration

The app uses Supabase configuration through Vite environment variables. Create a `.env` file in the project root if you want to override the defaults:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id
```

A ready-to-copy example is included in `.env.example`.

## Backend Database (Supabase)

This project already includes a Supabase database schema in `supabase/schema.sql` for:

- `system_status`
- `hazard_reports`
- `red_zones`
- `district_impacts`
- `hazard_vectors`
- `sos_pings`
- `safe_shelters`

### Set up the database

1. Create a new Supabase project in the Supabase dashboard.
2. Open the SQL editor and run the contents of `supabase/schema.sql`.
3. Copy the Project URL and anon/service role keys into `.env` and your Vercel environment variables.
4. In Vercel, add these variables under Project > Settings > Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

If the variables are not provided, the app falls back to the default Supabase project already embedded in the client, but production deployments should use your own project values.

## PWA Notes

This project is configured with the Vite PWA plugin, which enables:
- installable mobile app experience
- offline caching for route/map assets
- enhanced offline support for emergency use cases

## Scripts and Data Pipeline

The Python scripts under the `scripts/` folder support the processing side of the system:

- `calculate_safe_route.py` for route safety logic
- `monitor_hazards.py` for hazard monitoring automation
- `process_redzones.py` for red-zone processing and geospatial filtering

These can be extended or integrated with server-side data processing workflows.

## Supabase Schema

The project includes a SQL schema in `supabase/schema.sql` that defines the database tables used for hazard reporting, system status, shelters, and red zones.

## Use Cases

- disaster response coordination
- flood and landslide awareness
- tourism route safety for travelers
- emergency shelter discovery
- mobile-first reporting in low-connectivity environments

## License

This project is currently for local development and demo use unless a separate license is added by the repository owner.

## Credits

- Peak Protocol
- National Disaster Risk Reduction and Management Authority (NDRRMA) / Nepal context references
- Department of Hydrology and Meteorology (DHM)
- BIPAD and related disaster information infrastructure
- Nepal Army and local emergency response ecosystem references

## Notes

This app is intended as a resilient emergency-response and travel-safety platform for Nepal. It includes realistic sample data and live API integrations designed for demonstration and operational prototyping.
