# Skoop

A modern web application for managing and sharing learning resources.

## Features

- User authentication with Supabase
- Resource management with collections and tags
- Row-level security for data protection
- Modern UI with Next.js and Tailwind CSS
- Type-safe database access with Drizzle ORM

## Prerequisites

- Node.js 18 or later
- pnpm 8 or later
- Supabase account and project

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/skoop.git
   cd skoop
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   DATABASE_URL=your_database_url
   ```

4. Run database migrations:
   ```bash
   pnpm run db:generate
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report

### Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utility functions and shared code
│   ├── auth/        # Authentication related code
│   ├── db/          # Database access layer
│   └── utils/       # Utility functions
├── styles/          # Global styles
└── types/           # TypeScript type definitions
```

### Testing

The project uses Jest and React Testing Library for testing. Tests are located in `__tests__` directories next to the files they test.

### Database

The project uses Supabase as the backend and Drizzle ORM for type-safe database access. Database migrations are managed through the `supabase/migrations` directory.

### Authentication

Authentication is handled through Supabase Auth. The project includes a custom authentication context and hooks for managing user sessions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 