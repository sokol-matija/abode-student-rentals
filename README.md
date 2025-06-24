
# StudyNest - Student Accommodation Platform

A modern web application for connecting students with rental properties, featuring secure payments, messaging, and property management.

## Project info

**URL**: https://lovable.dev/projects/dac345e1-8fd2-422e-b254-40beb05a9d49

## Features

- 🏠 **Property Management** - Property owners can list and manage their rentals
- 👨‍🎓 **Student Dashboard** - Browse available properties and manage inquiries
- 💳 **Stripe Integration** - Secure monthly rent payments with subscription management
- 💬 **Messaging System** - Direct communication between students and property owners
- 🔐 **Role-Based Authentication** - Separate experiences for students and property owners
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Database, Auth, Real-time)
- **Payments**: Stripe (Subscriptions, Webhooks)
- **Build Tool**: Vite
- **Deployment**: Lovable Platform

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

### Using Lovable (Recommended)
Simply visit the [Lovable Project](https://lovable.dev/projects/dac345e1-8fd2-422e-b254-40beb05a9d49) and start prompting for changes.

### Using Your Preferred IDE
1. Make changes locally
2. Push to GitHub - changes will automatically sync with Lovable

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

## Deployment

### Lovable Platform (Recommended)
1. Open your [Lovable Project](https://lovable.dev/projects/dac345e1-8fd2-422e-b254-40beb05a9d49)
2. Click "Share" → "Publish"

### Custom Domain
To connect a custom domain:
1. Navigate to Project → Settings → Domains in Lovable
2. Click "Connect Domain"
3. Follow the setup instructions

Note: A paid Lovable plan is required for custom domains.

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
4. Test thoroughly
5. Submit a pull request

## Support

- [Lovable Documentation](https://docs.lovable.dev/)
- [Lovable Discord Community](https://discord.com/channels/1119885301872070706/1280461670979993613)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
