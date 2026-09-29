# HouseLink Marketplace Frontend

Buyer and admin frontend foundation for the HouseLink Marketplace backend.

## Stack

- Next.js 16.x
- React
- TypeScript
- Tailwind CSS
- App Router
- ESLint
- Axios
- Redux Toolkit
- React Redux
- Zod
- React Hook Form
- `@hookform/resolvers`
- Lucide React

## Local Setup

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

The API base URL is configured in `.env.local`:

```text
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Structure

```text
src/app
src/app/buyer
src/app/admin
src/components
src/features/buyer
src/features/admin
src/features/shared
src/lib
src/store
src/types
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
```
