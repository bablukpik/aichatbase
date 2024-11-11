# Chatbase Clone

A SaaS application similar to Chatbase.co, built with Next.js 14, TypeScript, Tailwind CSS, and Shadcn UI.

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
- Docker Compose (Multi-container Docker applications)
- Redux Toolkit (State management)
- OpenAI, Anthropic, Google, etc. (AI services)

## Key Features

- User authentication with Google OAuth and email/password
- Dashboard for managing chatbots
- File upload and management
- Subscription-based pricing with Stripe integration
- Responsive design for mobile and desktop
- Containerized development and production environments
- Responsive design for mobile and desktop
- Dark mode
- 🤖 Create and manage AI chatbots
- 📊 Analytics dashboard
- 💬 Real-time chat interface
- 📝 Document training
- 👥 Team management
- 🔑 API access
- 🌙 Dark mode
- 📱 Responsive design
- 🔒 Authentication with NextAuth.js
- 💳 Subscription management
- 🔍 Command palette (⌘K)
- 🌐 Multi-language support

## Getting Started

### Prerequisites

- Node.js 18 or later
- Docker and Docker Compose
- A Cloudflare R2 account
- A Stripe account
- A Google Cloud Platform account (for OAuth)

### Environment Variables

Create a `.env` file in the root directory with the variables from `.env.example`. Here is a command to copy the example file:

```bash
cp .env.example .env
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

src/
├── app/ # App router pages
│ ├── api/ # API routes
│ ├── dashboard/ # Dashboard pages
│ └── (auth)/ # Authentication pages
├── components/ # React components
│ ├── ui/ # UI components
│ └── ... # Feature components
├── lib/ # Utility functions
├── hooks/ # Custom hooks
└── types/ # TypeScript types

## Authentication

The application supports two authentication methods:

1. Google OAuth
2. Email and password

Users can sign up and log in using either method.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Chatbase.co](https://chatbase.co) for inspiration
- [Shadcn](https://twitter.com/shadcn) for the amazing UI components
- [Vercel](https://vercel.com) for the hosting platform
