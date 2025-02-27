# Property Tax Assessment Analysis Platform

A Next.js application designed to analyze property tax assessments and generate leads for tax attorneys. This platform helps streamline the process of identifying potential cases for property tax appeals.

## Overview

This application provides:
- Property tax assessment analysis tools
- Lead generation capabilities for tax attorneys
- Interactive data visualization
- Custom dashboard interfaces

## Prerequisites

### Node Version Manager (NVM)
This project uses Node.js version specified in the .nvmrc. To ensure compatibility, we recommend using NVM:

1. Install NVM from [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)
2. Install and use the correct Node version:
```bash
nvm install 18
nvm use 18
```

## Getting Started

First, install the dependencies:

```bash
# npm was used in development of this project
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.
- Note: dev port is set to 3001, since often a locally running API will be set to port 3000.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NODE_ENV=development
API_URL=http://localhost:3000
NEXTAUTH_SECRET="foobar"
```
- you can generate a new auth secret with many tools of course, though vercel offers [this one](https://www.npmjs.com/package/auth)

## Key Libraries and Tools

This project utilizes several key libraries:

### UI Components and Styling
- **shadcn/ui**: Custom UI components library
- **Tailwind CSS**: Utility-first CSS framework
- **Headless UI**: Unstyled, accessible UI components
- **Radix UI**: Low-level UI component primitives
- **Lucide React**: Icon set

### State Management and Data
- **Redux Toolkit**: State management
- **Redux Persist**: Local storage persistence
- **Axios**: HTTP client
- **JWT Decode**: Token parsing

### Visualization and Layout
- **Recharts**: Composable charting library
- **Leaflet**: Interactive maps
- **React Grid Layout**: Draggable and resizable grid system

### Development Tools
- **TypeScript**: Static type checking
- **ESLint**: Code linting
- **Faker**: Generate realistic test data

## Adding UI Components with shadcn/ui

To add new UI components using shadcn/ui:

1. First-time setup:
```bash
npx shadcn@canary init
```

2. Add individual components:
```bash
npx shadcn@canary add [component-name]
```

Example:
```bash
npx shadcn@canary add button
npx shadcn@canary add card
npx shadcn@canary add dialog
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deployment

The application can be deployed using Vercel or any other Next.js-compatible hosting platform. For production builds:

```bash
npm run build
npm run start
```
