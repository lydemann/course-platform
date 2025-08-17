# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Nx monorepo containing a course platform with multiple applications and shared libraries. The platform includes:

- **course-platform-analog**: Main application built with Analog (Angular meta-framework with Vite)
- **course-admin**: Admin interface for managing courses
- **course-client**: Client interface for course consumption
- **course-service**: Backend GraphQL service with tRPC

## Technology Stack

- **Frontend**: Angular 18 with TypeScript
- **Build System**: Nx monorepo with Vite (Analog) and esbuild
- **State Management**: NgRx for complex state, standalone services for simpler cases
- **Backend**: tRPC with Supabase
- **Database**: Supabase PostgreSQL with Drizzle ORM
- **Authentication**: Supabase Auth
- **Styling**: SCSS with Tailwind CSS
- **Testing**: Jest for unit tests, Cypress for e2e tests

## Architecture

The monorepo follows Nx conventions with domain-driven design:

### Applications

- `apps/course-platform-analog/` - Main Analog application (default project)
- `apps/course-admin/` - Angular admin app (port 4201)
- `apps/course-client/` - Angular client app (port 4200)
- `apps/course-service/` - Backend tRPC service

### Library Structure

- `libs/course-admin/` - Admin-specific features and UI
- `libs/course-client/` - Client-specific features and UI
- `libs/shared/` - Shared libraries across applications
  - `shared/domain/` - Business logic and data access
  - `shared/interfaces/` - TypeScript interfaces
  - `shared/ui/` - Reusable UI components
  - `shared/auth/` - Authentication logic

### Key Shared Libraries

- `@course-platform/shared/domain/trpc-server` - tRPC server with Drizzle ORM
- `@course-platform/shared/domain/trpc-client` - tRPC client
- `@course-platform/shared/ui` - Shared UI components with Material Design

## Common Development Commands

### Building and Serving

```bash
# Serve main Analog app (default)
nx serve course-platform-analog

# Serve admin app
nx serve course-admin

# Serve client app
nx serve course-client

# Build all apps
nx build

# Build specific app
nx build course-platform-analog
nx build course-admin
nx build course-client

# or for Vercel builds:
npm run build:course-platform-analog
# or manually:
NODE_OPTIONS="--max-old-space-size=16384" nx build course-platform-analog
```

### Testing

```bash
# Run all tests
nx test

# Run tests for specific project
nx test course-admin
nx test course-client

# Run e2e tests
nx e2e course-admin-e2e
nx e2e course-client-e2e

# Run affected tests only
nx affected:test
```

### Linting and Formatting

```bash
# Lint all projects
nx lint

# Lint specific project
nx lint course-platform-analog

# Format code
nx format:write
```

### Backend and Deployment

```bash
# Deploy Analog app
npm run deploy:analog
```

### Database Management

```bash
# Generate Drizzle migrations
npm run drizzle-generate

# Run Drizzle migrations
npm run drizzle-migrate

# Pull database schema
npm run drizzle-pull
```

### Nx Utilities

```bash
# Show dependency graph
nx dep-graph

# Run affected commands
nx affected:build
nx affected:test
nx affected:lint

# Generate new components/libraries
nx g @nx/angular:lib my-lib
nx g @nx/angular:component my-component
```

## Environment Configuration

The project uses multiple environment files:

- `environment.ts` - Development
- `environment.local.ts` - Local development
- `environment.prod.ts` - Production

Each application has its own environment configuration in their respective shared/domain libraries.

## Database Setup

The project uses Supabase as the primary backend:

- **Database**: PostgreSQL with Drizzle ORM for data management
- **Authentication**: Supabase Auth for user management
- **Real-time**: Supabase real-time subscriptions
- **Configuration**: Database configuration in `libs/shared/domain/trpc-server/src/lib/drizzle/`

## Module Federation

The admin and client apps use Module Federation for microfrontend architecture. Check `module-federation.config.js` files in each app.

## Path Aliases

TypeScript path aliases are configured in `tsconfig.base.json` using the `@course-platform/` prefix for all libraries.
