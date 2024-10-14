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
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=your_database_name
DATABASE_URL=postgresql://your_postgres_user:your_postgres_password@db:5432/your_database_name
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

#### Production

To run the application in production mode:

```bash
npm run start:prod
```

This command uses Docker Compose with `docker-compose.yml` and `docker-compose.prod.yml` files.

### Database Management

To run Prisma migrations:

```bash
npm run db:migrate
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

## Docker Configuration

The project uses Docker for both development and production environments:

- `Dockerfile`: Defines the container for the Next.js application
- `docker-compose.yml`: Main Docker Compose configuration
- `docker-compose.override.yml`: Development-specific overrides
- `docker-compose.prod.yml`: Production-specific overrides

## Authentication

The application supports two authentication methods:

1. Google OAuth
2. Email and password

Users can sign up and log in using either method.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
