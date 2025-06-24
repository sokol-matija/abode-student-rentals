
# StudyNest - Student Accommodation Platform

A modern web application for connecting students with rental properties, featuring secure payments, messaging, and property management.

## Project info


## Features

- 🏠 **Property Management** - Property owners can list and manage their rentals
- 👨‍🎓 **Student Dashboard** - Browse available properties and manage inquiries
- 💳 **Stripe Integration** - Secure monthly rent payments with subscription management
- 💬 **Messaging System** - Direct communication between students and property owners
- 🔐 **Role-Based Authentication** - Separate experiences for students and property owners
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend Technologies

**Core Framework & Build Tools:**
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing for navigation

**UI & Styling:**
- **Tailwind CSS** - Utility-first CSS framework for styling
- **shadcn/ui** - High-quality React component library built on Radix UI
- **Radix UI** - Unstyled, accessible UI primitives (dialogs, dropdowns, etc.)
- **Lucide React** - Beautiful icon library
- **class-variance-authority** & **clsx** - Utility libraries for conditional CSS classes

**State Management & Data Fetching:**
- **TanStack React Query** - Server state management and caching
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation for forms and data

**Charts & Visualization:**
- **Recharts** - React charting library for data visualization

### Backend & Database

**Backend as a Service:**
- **Supabase** - Complete backend solution providing:
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication (Google OAuth, email/password)
  - Row Level Security (RLS)
  - Edge Functions (serverless functions)
  - File storage capabilities

**Database Schema:**
- **profiles** - User profile information
- **properties** - Property listings with amenities and details
- **inquiries** - Student inquiries about properties
- **inquiry_messages** - Messaging between students and property owners
- **rent_payments** - Stripe payment tracking and subscriptions

### Payment Processing

**Stripe Integration:**
- **Stripe Checkout** - Secure payment processing
- **Stripe Subscriptions** - Monthly rent payment management
- **Stripe Customer Portal** - Subscription management for users
- **Stripe Webhooks** - Real-time payment status updates

### Authentication & Security

**User Authentication:**
- **Supabase Auth** - Built-in authentication system
- **Google OAuth** - Social login integration
- **Row Level Security** - Database-level security policies
- **JWT tokens** - Secure session management

### Testing

**Testing Framework:**
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing utilities
- **jsdom** - DOM simulation for testing
- **@testing-library/jest-dom** - Custom Jest matchers

### Development Tools

**Code Quality:**
- **ESLint** - Code linting and formatting
- **TypeScript strict mode** - Enhanced type checking

**Additional Libraries:**
- **date-fns** - Date manipulation utilities
- **react-day-picker** - Date picker component
- **sonner** - Toast notifications
- **next-themes** - Theme management (dark/light mode support)

## Architecture Patterns

**Component Architecture:**
- Modular component structure with focused, single-responsibility components
- Custom hooks for business logic
- Service layer for database operations
- Type-safe API interactions

## Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup** (Optional for development)
   Create a `.env.local` file in the root directory:
   ```bash
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   Note: The app will work without this file as it has fallback values.

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

5. **Run tests**
   ```bash
   npm run test
   ```

### Localhost Considerations

**Authentication Setup**: 
- You may need to add `http://localhost:5173` to your Supabase project's Auth settings under "Site URL" and "Redirect URLs"
- Go to: Supabase Dashboard → Authentication → URL Configuration

**Stripe Payments**: 
- Stripe webhooks won't work on localhost
- For testing payments locally, use Stripe CLI:
  ```bash
  stripe listen --forward-to localhost:5173/api/webhooks/stripe
  ```

**Database**: 
- The app connects to the live Supabase database
- Be careful when testing to avoid affecting production data

## How to Edit This Code

### Using GitHub Codespaces
1. Navigate to your repository
2. Click "Code" → "Codespaces" → "New codespace"
3. Edit files directly in the browser

## Database Schema

The application uses the following main tables:
- `profiles` - User profiles (students/property owners)
- `properties` - Property listings with details and amenities
- `inquiries` - Student inquiries about properties
- `inquiry_messages` - Messages between students and property owners
- `rent_payments` - Stripe subscription tracking for rent payments

## Environment Variables for Production

When deploying to other platforms (Vercel, Netlify, etc.), set these environment variables:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Stripe Configuration

For payment functionality, ensure these secrets are configured in your Supabase Edge Functions:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly using `npm run test`
5. Submit a pull request
