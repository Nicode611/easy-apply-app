# Next.js SaaS Template

A complete SaaS template built with:

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [Prisma](https://www.prisma.io/) - Database ORM
- [Auth.js (NextAuth.js)](https://next-auth.js.org/) - Authentication

## Features

- 🔐 User authentication with email/password and Google OAuth
- 👤 User management with roles (user/admin)
- 📱 Responsive design for all devices
- 🚀 Modern UI with TailwindCSS
- 📊 Dashboard with user information
- 🔄 Global state management with Redux Toolkit
- 🛡️ Route protection with middleware

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/saas-template.git
cd saas-template
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

Create a `.env` file in the root of the project with the following variables:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/saas_template"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. Set up the database:

```bash
npx prisma migrate dev --name init
```

5. Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
/
├── prisma/              # Prisma schema and migrations
├── public/              # Static assets
├── src/
│   ├── app/             # App router pages and route handlers
│   │   ├── api/         # API routes
│   │   ├── dashboard/   # Dashboard pages
│   │   ├── login/       # Login page
│   │   └── register/    # Register page
│   ├── components/      # React components
│   │   ├── auth/        # Authentication components
│   │   └── ui/          # UI components
│   ├── lib/             # Utility functions
│   │   ├── prisma.ts    # Prisma client
│   │   ├── auth.ts      # Auth.js configuration
│   │   └── redux/       # Redux setup
│   └── types/           # TypeScript type definitions
└── middleware.ts        # Next.js middleware for route protection
```

## Customization

- **Styling**: You can customize the design by modifying the Tailwind classes in the components.
- **Database**: Update the Prisma schema in `prisma/schema.prisma` to match your data model.
- **Authentication**: Modify `src/lib/auth.ts` to add more authentication providers.

## Deployment

The application can be deployed to any platform that supports Next.js, such as Vercel, Netlify, or your own server.

```bash
npm run build
# or
yarn build
```

## License

MIT
