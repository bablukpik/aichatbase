# Chatbase Clone

This project is a SaaS application similar to Chatbase.co, built with Next.js, Prisma, PostgreSQL, and various other technologies.

## Technologies Used

- Next.js 14 (React framework for production)
- TypeScript (Static type-checking)
- Prisma (ORM for database management)
- PostgreSQL (Relational database)
- NextAuth.js (Authentication for Next.js)
- Stripe (Payment processing)
- TailwindCSS (Utility-first CSS framework)
- ShadCN UI (Accessible and customizable UI components)
- R2 (Cloudflare) for file storage
- Docker (Containerization)
- Docker Compose (Multi-container Docker applications)
- Node.js (JavaScript runtime)
- npm (Package manager)
- ESLint (JavaScript linter)
- Prettier (Code formatter)
- Git (Version control)
- GitHub Actions (CI/CD)
- Vercel (Deployment platform, optional)

## Key Features

- User authentication with Google OAuth and email/password
- Dashboard for managing chatbots
- File upload and management
- Subscription-based pricing with Stripe integration
- Responsive design for mobile and desktop
- Containerized development and production environments

## Getting Started

### Prerequisites

- Node.js 18 or later
- Docker and Docker Compose
- A Cloudflare R2 account
- A Stripe account
- A Google Cloud Platform account (for OAuth)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
DB_HOST=db
DB_USER=admin
DB_PASSWORD=admin
DB_NAME=aichatbase_db
DB_PORT=5432
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"
DB_NAME_SHADOW=aichatbase_db_shadow

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

STRIPE_SECRET_KEY=your_stripe_secret_key

R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET=your_r2_bucket_name
```

### Running the Application

#### Development

To run the application in development mode:

```bash
npm run dev
```

This command uses Docker Compose with the default `docker-compose.yml` and `docker-compose.override.yml` files.

This command uses Docker Compose with `docker-compose.yml` and `docker-compose.prod.yml` files.

### Database Management

To run Prisma migrations:

```bash
npm run db:migrate:dev
```

To generate Prisma client:

```bash
npm run db:generate
```

### Stopping the Application

To stop and remove containers:

```bash
npm run down
```

## Project Structure

- `src/app/`: Contains the Next.js pages and API routes
- `src/components/`: Reusable React components
- `src/lib/`: Utility functions and configurations
- `prisma/`: Prisma schema and migrations
- `public/`: Static assets

## Authentication

The application supports two authentication methods:

1. Google OAuth
2. Email and password

Users can sign up and log in using either method.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
