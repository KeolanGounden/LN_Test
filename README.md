# LN_Test — Local Development

This repository contains an Angular frontend and an ASP.NET backend for Product Management. The instructions below explain how to build, test, and run the app locally, and how to run it using Docker.

## Prerequisites
- .NET SDK 8.0 (or compatible runtime that matches the project)
- Node.js 16+ and npm
- Angular CLI for local dev server: `npm install -g @angular/cli`
- Docker & Docker Compose to run containers

## Repository layout
- `Backend/` — ASP.NET solution and API (ProductManagementAPI)
- `Frontend/` — Angular application

## Build and run (local, no Docker)

1) Backend (ASP.NET)

 - Open a terminal and go to the backend folder:

```powershell
cd Backend
```

 - Restore and build the solution:

```powershell
dotnet restore ProductManagement.sln
dotnet build ProductManagement.sln -c Debug
```

 - Run the API (development):

```powershell
dotnet run --project ProductManagementAPI/ProductManagementAPI.csproj
```

 By default the API will bind to the ports configured in `docker-compose.override.yml`; typical local URL is `http://localhost:17475` (check docker).

2) Frontend (Angular)

 - Open a terminal and go to the frontend folder:

```powershell
cd Frontend
```

 - Install dependencies and run in development mode:

```powershell
npm install
npm run start
# or, if you have Angular CLI:
ng serve --open
```

 - Default Angular dev server runs on `http://localhost:4200`.

3) Accessing the app

 - Visit the frontend URL in your browser (typically `http://localhost:4200`). The frontend will make API calls to the backend;

## Build and run using Docker Compose

- Docker compose files are in `Backend/`.

From the repo root or `Backend/` directory:

```powershell
cd Backend
docker-compose up --build
```

This will build the backend image and start the service. 

## Tests


- Frontend: run:

```powershell
cd Frontend
npm test
```


## Configuration

- Backend configuration files: `Backend/ProductManagementAPI/appsettings.json` and `appsettings.Development.json`.
- Frontend environment files: `Frontend/src/environments/` (edit API base URLs there for local development).

## Common troubleshooting
- Port collisions: ensure backend and frontend ports (default 17475 and 4200) are free.
- CORS issues: enable CORS in the ASP.NET API during development, or configure an Angular proxy.
- Missing packages: run `dotnet restore` and `npm install` in respective folders.
