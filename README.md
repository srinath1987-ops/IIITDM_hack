# Logistics Route Optimization System

A comprehensive logistics route optimization system with real-time traffic integration, truck-specific routing, and toll information.

## Features

- Real-time traffic data integration using MapMyIndia API
- Truck-specific route optimization with GraphHopper and OSRM
- Multiple alternate routes display
- Road closure information from OpenStreetMap
- Toll cost estimation using TollGuru API
- Real-time updates via WebSockets

## Prerequisites

- Node.js (v16+)
- PostgreSQL with PostGIS extension
- Supabase account (for real-time updates)
- API keys for:
  - MapMyIndia
  - GraphHopper
  - TollGuru

## Setup

### 1. Database Setup

1. Install PostgreSQL and PostGIS extension
2. Create a new database named `route_mapper`
3. Run the SQL script in `backend/db/init.sql` to set up the tables

```bash
psql -U postgres -d route_mapper -f backend/db/init.sql
```

### 2. Backend Setup

1. Navigate to the backend directory

```bash
cd route-mapper-vite/backend
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables
   - Copy `.env.example` to `.env`
   - Update the values with your database credentials and API keys

4. Start the server

```bash
npm start
```

The backend server will be available at http://localhost:5000

### 3. Frontend Setup

1. Navigate to the frontend directory (from the project root)

```bash
cd route-mapper-vite
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables
   - Copy `.env.example` to `.env`
   - Update the Supabase URL and key

4. Start the frontend development server

```bash
npm run dev
```

The frontend will be available at http://localhost:5173

## API Keys Setup

### MapMyIndia API
- Register at [MapMyIndia API Portal](https://www.mapmyindia.com/api/)
- Create a project and get your API key
- Add the key to the `.env` file as `MAPMYINDIA_API_KEY`

### GraphHopper API
- Register at [GraphHopper Dashboard](https://graphhopper.com/dashboard/)
- Create a new API key
- Add the key to the `.env` file as `GRAPHHOPPER_API_KEY`

### TollGuru API
- Register at [TollGuru Developer Portal](https://tollguru.com/developers)
- Create a new API key
- Add the key to the `.env` file as `TOLLGURU_API_KEY`

### Supabase
- Create a new project at [Supabase](https://app.supabase.io/)
- Get the URL and API key from the project settings
- Add these values to both backend and frontend `.env` files

## Usage

1. Enter the start and end coordinates in the form (default is Chennai to Mumbai)
2. Click "Get Routes" to calculate and display routes
3. Select different routes to view their details (distance, duration, toll costs)
4. The map will update with real-time traffic and closure information

## License

This project is licensed under the MIT License - see the LICENSE file for details.
