# PocketWatcher

[![Next.js](https://img.shields.io/badge/Next.js-15%2B-black)](https://nextjs.org/)
[![PocketBase](https://img.shields.io/badge/PocketBase-0.23-blue)](https://pocketbase.io/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-purple)](https://ui.shadcn.com/)
[![Bun](https://img.shields.io/badge/Bun-1.0%2B-black)](https://bun.sh/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## Overview

A modern full-stack template that combines the power of Next.js, the simplicity of PocketBase, and the beauty of shadcn/ui. Perfect for quickly bootstrapping production-ready web applications with authentication and a polished UI.

## Features

- 🚀 Next.js 15+ App Router
- 📦 PocketBase backend with built-in authentication
- 🎨 Beautiful UI components from shadcn/ui
- 🌐 Server-side rendering and client-side interactivity
- 🔄 Form handling with React Server Actions
- 🔐 Complete authentication system with email/password
- 🐳 Production-ready Docker setup
- ☁️ One-command deployment to Fly.io
- 🔒 Secure cookie-based authentication
- 🛡️ Type-safe development with TypeScript
- ⚡ Bun for fast package management and running scripts

## Getting Started

### Prerequisites

- Bun runtime
- Fly.io CLI (for deployment)

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/yourusername/pocketwatcher.git
cd pocketwatcher
```

2. Install dependencies:

```bash
bun install
```

3. Start the development servers:

In one terminal, start PocketBase:

```bash
./pocketbase serve
```

In another terminal, start the Next.js development server:

```bash
bun run dev
```

4. Access the applications:
   - Next.js: http://localhost:3000
   - PocketBase Admin: http://localhost:8090/\_/

## Deployment

1. Install the Fly.io CLI:

```bash
curl -L https://fly.io/install.sh | sh
fly auth login
```

2. Deploy the application:

```bash
bun run launch
```

You can either accept the defaults by selecting "No" when asked to tweak settings, or customize them according to your needs.

3. During deployment, you'll be prompted twice:

   - When asked "Do you want to tweak these settings before proceeding?" → Type `No`
   - When asked "Would you like to allocate dedicated ipv4 and ipv6 addresses now?" → Type `Yes`

4. After deployment, find your PocketBase admin setup URL:

```bash
fly logs | grep pbinstal
```

5. Access the admin setup URL by replacing:
   - Change `http://0.0.0.0:8090` to `https://your-app-name.fly.dev:8091`
   - Keep the rest of the URL path and token

Your app will be available at:

- App: https://your-app-name.fly.dev
- Admin: https://your-app-name.fly.dev:8091/_/

### Authentication Features

- Secure login system with email/password
- User registration with password confirmation
- Server-side form validation
- Protected routes and authenticated sessions
- Secure cookie handling
- Automatic redirects after authentication
- Error handling and user feedback
- Type-safe authentication actions

## Project Structure

```
├── src/
│   ├── app/                    # Next.js application
│   │   ├── actions/           # Server actions
│   │   ├── api/              # API routes
│   │   ├── auth/             # Authentication pages
│   │   └── page.tsx          # Home page
│   ├── components/            # React components
│   │   ├── ui/              # shadcn/ui components
│   │   └── auth/            # Authentication components
│   └── lib/                  # Utility functions and configs
├── public/                   # Static assets
├── pb_data/                  # PocketBase data directory
└── Dockerfile               # Production Docker configuration
```

## Authentication Flow

1. User enters credentials on login/register page
2. Form data is processed by server actions
3. PocketBase validates credentials
4. On success:
   - Auth token is stored in HTTP-only cookie
   - User is redirected to dashboard
5. On error:
   - User receives feedback message
   - Form remains interactive

## Security Features

- HTTP-only cookies for token storage
- Server-side validation
- Password confirmation on registration
- Secure password handling
- Protected API routes
- Type-safe authentication flow
- CSRF protection with Next.js
- Secure session management

## Configuration Files

### fly.toml

The `fly.toml` configuration file sets up:

- App name and organization
- Region configuration
- Machine specifications (shared-cpu-1x, 1GB RAM)
- Service ports for PocketBase (8090/8091) and Next.js (3000)
- Volume mounts for persistent PocketBase data

### supervisor.conf

Supervisor manages both services in production:

- Next.js application
- PocketBase server
- Process monitoring and automatic restarts
- Log management

### Dockerfile

Multi-stage build process that:

- Builds the Next.js application
- Sets up PocketBase
- Configures the production environment
- Handles service orchestration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
