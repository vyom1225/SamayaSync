# Samaya

<div align="center">

```mermaid
graph LR
    A[👤 User] -->|Creates| B[📅 Event Types]
    B -->|Shares| C[🔗 Booking Link]
    C -->|Visits| D[👥 Guest]
    D -->|Books| E[📆 Calendar Event]
    E -->|Auto-creates| F[🎥 Video Link]
    
    style A fill:#3b82f6
    style B fill:#10b981
    style C fill:#f59e0b
    style D fill:#8b5cf6
    style E fill:#ec4899
    style F fill:#06b6d4
```

**A modern scheduling platform that makes booking meetings effortless.**

*Think of it as your personal scheduling assistant that handles calendar sync, availability management, and meeting creation automatically.*

</div>

## What is Samaya?

Samaya is a full-featured appointment booking system that lets you create customizable meeting types and share them with others. When someone books a time slot, Samaya automatically checks your real calendar availability, creates the event, and sends out video conference links—all without you lifting a finger.

The name "Samaya" means "time" in Sanskrit, which perfectly captures what this application is all about: managing your time efficiently.

## The Problem It Solves

Anyone who's ever tried to schedule meetings knows the pain: endless back-and-forth emails, checking calendars manually, forgetting to send video links, or accidentally double-booking yourself. Samaya eliminates all of that by:

- Automatically syncing with your existing calendar (Google, Outlook, etc.)
- Showing only your actual free time slots
- Creating calendar events automatically when someone books
- Generating video conference links (Google Meet, Zoom, Teams)
- Sending notifications to all participants

## Core Features

### For Event Hosts

**Event Type Management**
- Create multiple event types (e.g., "30-minute coffee chat", "1-hour consultation")
- Set custom durations (15, 30, 45, or 60 minutes)
- Add descriptions and choose video call providers
- Generate unique booking URLs for each event type
- Toggle events on/off without deleting them
- Edit or delete event types anytime

**Availability Control**
- Set working hours for each day of the week
- Enable or disable specific days
- Different time ranges for different days
- Changes reflect immediately in booking pages

**Calendar Integration**
- Connect your Google Calendar, Outlook, or other calendars via Nylas
- Real-time availability checking
- Automatic event creation when bookings happen
- No double-bookings—your calendar is always up to date

**Meeting Management**
- View all upcoming bookings in one place
- See meeting details, participants, and video links
- Cancel meetings directly from the dashboard
- All meetings automatically appear in your connected calendar

**Profile Customization**
- Set your username (used in booking URLs)
- Upload profile picture
- Update your display name

### For People Booking Meetings

**Intuitive Booking Experience**
- Clean, distraction-free booking page
- Visual calendar showing available dates
- Time slot picker showing only free times
- Form to enter name, email, and optional notes
- Instant confirmation after booking

**Smart Availability**
- Only shows times you're actually free
- Respects your working hours
- Prevents booking in the past
- Updates in real-time as your calendar changes

## Technical Architecture

### Technology Stack

**Frontend**
- Next.js 15 with App Router for server-side rendering and routing
- React 19 for the UI layer
- TypeScript for type safety
- Tailwind CSS for styling
- Radix UI components for accessible UI primitives
- shadcn/ui component library
- Lucide React for icons

**Backend**
- Next.js Server Actions for form handling and mutations
- NextAuth v5 for authentication (GitHub and Google OAuth)
- Prisma ORM for database operations
- PostgreSQL as the database
- Nylas API for calendar integration

**Additional Services**
- UploadThing for file uploads (profile pictures)
- Sonner for toast notifications
- Conform + Zod for form validation
- date-fns for date manipulation

### System Architecture

```mermaid
graph TB
    subgraph "Client"
        Browser[Browser]
    end
    
    subgraph "Next.js Application"
        Frontend[React Components]
        ServerActions[Server Actions]
        APIRoutes[API Routes]
        Auth[NextAuth]
    end
    
    subgraph "Database"
        PostgreSQL[(PostgreSQL)]
        Prisma[Prisma ORM]
    end
    
    subgraph "External Services"
        Nylas[Nylas API<br/>Calendar Integration]
        OAuth[OAuth Providers<br/>GitHub, Google]
        UploadThing[UploadThing<br/>File Storage]
    end
    
    Browser --> Frontend
    Frontend --> ServerActions
    Frontend --> APIRoutes
    ServerActions --> Prisma
    APIRoutes --> Auth
    APIRoutes --> Nylas
    Auth --> OAuth
    Prisma --> PostgreSQL
    ServerActions --> UploadThing
    ServerActions --> Nylas
```

### Database Schema

The application uses Prisma to manage the following data models:

**User**
- Stores authentication information (NextAuth integration)
- Profile data (name, email, username, image)
- Calendar connection details (grantId, grantEmail from Nylas)
- Relationships to availability, event types, and sessions

**EventType**
- Meeting configurations created by users
- Includes title, duration, description, URL slug
- Video call provider preference
- Active/inactive status

**Availability**
- Weekly schedule for each user
- One record per day of the week
- Start and end times for each day
- Enable/disable toggle per day

**Account & Session**
- Managed by NextAuth for OAuth providers
- Handles authentication tokens and sessions

### Database Relationships

```mermaid
erDiagram
    User ||--o{ EventType : creates
    User ||--o{ Availability : has
    User ||--o{ Account : "has OAuth"
    User ||--o{ Session : "has sessions"
    
    User {
        string id PK
        string email UK
        string username UK
        string name
        string image
        string grantId
        string grantEmail
    }
    
    EventType {
        string id PK
        string userId FK
        string title
        int duration
        string description
        string url
        boolean active
        string videoCallSoftware
    }
    
    Availability {
        string id PK
        string userId FK
        enum day
        string fromTime
        string tillTime
        boolean isActive
    }
    
    Account {
        string userId FK
        string provider
        string providerAccountId
        string access_token
    }
    
    Session {
        string sessionToken PK
        string userId FK
        datetime expires
    }
```

### Application Flow

**User Journey Overview**

```mermaid
flowchart TD
    Start([New User]) --> SignIn[Sign in with OAuth]
    SignIn --> Onboarding{Has Username?}
    Onboarding -->|No| SetProfile[Set Username & Name]
    SetProfile --> ConnectCalendar[Connect Calendar]
    ConnectCalendar --> Dashboard[Dashboard]
    Onboarding -->|Yes| Dashboard
    
    Dashboard --> CreateEvent[Create Event Type]
    CreateEvent --> ShareLink[Share Booking Link]
    ShareLink --> Wait[Wait for Bookings]
    
    Dashboard --> ManageAvail[Manage Availability]
    ManageAvail --> Dashboard
    
    Dashboard --> ViewMeetings[View Meetings]
    ViewMeetings --> Dashboard
    
    Wait --> Booking[Guest Books Meeting]
    Booking --> AutoCreate[Auto-create Calendar Event]
    AutoCreate --> Notify[Send Notifications]
    Notify --> ViewMeetings
    
    style Start fill:#3b82f6
    style Dashboard fill:#10b981
    style Booking fill:#f59e0b
    style AutoCreate fill:#ec4899
```

**User Onboarding**
1. User signs in with GitHub or Google OAuth
2. If new user, redirected to onboarding page
3. User sets username and full name
4. System creates default availability (9 AM - 5 PM, Monday-Friday)
5. User connects calendar via Nylas OAuth flow
6. Redirected to dashboard

**Creating an Event Type**
1. User navigates to "Create New Event" from dashboard
2. Fills out form: title, URL slug, description, duration, video provider
3. Form validated client-side with Conform/Zod
4. Server action creates event type in database
5. User can now share the booking link: `yoursite.com/username/event-url`

**Booking Flow**
1. Someone visits the booking page
2. System fetches event type details and user availability
3. Calendar component shows available dates (respecting working hours)
4. User selects a date
5. System queries Nylas API for free/busy times on that date
6. Available time slots calculated (accounting for event duration and busy times)
7. User selects a time slot
8. Booking form appears with event details
9. User fills in name, email, optional notes
10. Server action creates calendar event via Nylas API
11. Video conference link automatically added
12. Participants receive calendar invites
13. Redirect to success page

**Availability Management**
1. User navigates to Availability page
2. Sees all 7 days of the week with current settings
3. Can toggle days on/off
4. Can change start/end times for each day
5. Changes saved via server action
6. Updates immediately affect booking page availability

### Key Design Decisions

**Server Actions Over API Routes**
- Next.js Server Actions provide a simpler, type-safe way to handle mutations
- Automatic revalidation of routes after data changes
- Better integration with React Server Components
- Less boilerplate than traditional REST APIs

**Nylas for Calendar Integration**
- Unified API for multiple calendar providers (Google, Outlook, iCloud, etc.)
- Handles OAuth complexity
- Provides free/busy checking and event creation
- Reduces maintenance burden vs. integrating each provider separately

**Real-time Availability Calculation**
- On each booking page load, queries Nylas for that specific date
- Calculates available slots by:
  - Starting from user's working hours
  - Generating slots based on event duration
  - Filtering out busy times from calendar
  - Removing past time slots
- Ensures accuracy without caching issues

**Form Validation Strategy**
- Client-side validation with Zod schemas via Conform
- Server-side re-validation in actions
- Progressive enhancement (works without JavaScript)
- Clear error messages displayed inline

**Authentication Flow**
- NextAuth handles OAuth providers
- Prisma adapter stores sessions and accounts
- Protected routes use server-side auth checks
- Automatic redirects for unauthenticated users

### File Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (bookingPage)/           # Public booking pages (no auth required)
│   │   └── [username]/[eventUrl]/
│   ├── api/                     # API routes
│   │   ├── auth/                # NextAuth handlers
│   │   ├── oauth/               # Nylas OAuth callback
│   │   └── uploadthing/         # File upload endpoints
│   ├── dashboard/               # Protected dashboard pages
│   │   ├── availability/        # Manage working hours
│   │   ├── event/[eventTypeId]/ # Edit/delete events
│   │   ├── meetings/            # View bookings
│   │   ├── new/                 # Create event type
│   │   └── settings/            # Profile settings
│   ├── onboarding/              # First-time user setup
│   └── page.tsx                 # Landing page
├── components/                   # React components
│   ├── bookingForm/             # Calendar and time picker
│   ├── ui/                      # shadcn/ui components
│   └── [various].tsx            # Feature components
└── lib/                         # Utilities and configs
    ├── auth.ts                  # NextAuth configuration
    ├── db.ts                    # Prisma client
    ├── nylas.ts                 # Nylas API client
    ├── hooks.ts                 # Server-side auth hooks
    └── zodSchema.ts             # Validation schemas
```

## Getting Started

### Prerequisites

- Node.js 18.x or later
- PostgreSQL database
- Nylas account (for calendar integration)
- GitHub/Google OAuth apps (for authentication)
- UploadThing account (for file uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd samaya
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/samaya"
   DIRECT_URL="postgresql://user:password@localhost:5432/samaya"
   
   # NextAuth
   AUTH_SECRET="your-secret-key-here"
   AUTH_URL="http://localhost:3000"
   
   # OAuth Providers
   AUTH_GITHUB_ID="your_github_client_id"
   AUTH_GITHUB_SECRET="your_github_client_secret"
   AUTH_GOOGLE_ID="your_google_client_id"
   AUTH_GOOGLE_SECRET="your_google_client_secret"
   
   # Nylas Calendar Integration
   NYLAS_CLIENT_ID="your_nylas_client_id"
   NYLAS_SECRET_API_KEY="your_nylas_api_key"
   NYLAS_API_URI="https://api.nylas.com"
   
   # UploadThing
   UPLOADTHING_SECRET="your_uploadthing_secret"
   UPLOADTHING_APP_ID="your_uploadthing_app_id"
   
   # Application
   NEXT_PUBLIC_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## How It Works: Deep Dive

### Booking Flow Diagram

```mermaid
sequenceDiagram
    participant Guest as Guest User
    participant BookingPage as Booking Page
    participant Server as Server
    participant DB as Database
    participant Nylas as Nylas API
    participant Calendar as User's Calendar
    
    Guest->>BookingPage: Visit booking URL
    BookingPage->>Server: Fetch event type & availability
    Server->>DB: Get event details
    Server->>DB: Get user availability settings
    DB-->>Server: Return data
    Server-->>BookingPage: Event info & working hours
    BookingPage-->>Guest: Show calendar & time slots
    
    Guest->>BookingPage: Select date
    BookingPage->>Server: Request available times
    Server->>Nylas: Get free/busy for date
    Nylas->>Calendar: Check calendar
    Calendar-->>Nylas: Return busy slots
    Nylas-->>Server: Free/busy data
    Server->>Server: Calculate available slots
    Server-->>BookingPage: Available time slots
    BookingPage-->>Guest: Show time picker
    
    Guest->>BookingPage: Select time & fill form
    Guest->>BookingPage: Submit booking
    BookingPage->>Server: Create meeting
    Server->>Nylas: Create calendar event
    Nylas->>Calendar: Add event with video link
    Calendar-->>Nylas: Event created
    Nylas-->>Server: Success + event details
    Server->>DB: (Optional: Store booking)
    Server-->>BookingPage: Redirect to success
    BookingPage-->>Guest: Confirmation page
```

### Calendar Integration Flow

```mermaid
sequenceDiagram
    participant User
    participant App as Samaya App
    participant Nylas as Nylas OAuth
    participant Calendar as Calendar Provider
    
    Note over User,Calendar: Initial Calendar Connection
    User->>App: Click "Connect Calendar"
    App->>Nylas: Redirect to OAuth
    Nylas->>Calendar: Request authorization
    Calendar->>User: Show consent screen
    User->>Calendar: Grant access
    Calendar->>Nylas: Return auth code
    Nylas->>App: Redirect with code
    App->>Nylas: Exchange code for token
    Nylas-->>App: Return grantId & email
    App->>App: Store grantId in database
    
    Note over User,Calendar: Checking Availability
    User->>App: Select date on booking page
    App->>Nylas: getFreeBusy(grantId, date)
    Nylas->>Calendar: Query calendar
    Calendar-->>Nylas: Return busy slots
    Nylas-->>App: Free/busy data
    App->>App: Calculate available slots
    
    Note over User,Calendar: Creating Booking
    User->>App: Submit booking form
    App->>Nylas: Create event (grantId, details)
    Nylas->>Calendar: Create calendar event
    Calendar->>Calendar: Generate video link
    Calendar-->>Nylas: Event created
    Nylas-->>App: Event details
    App-->>User: Booking confirmed
```

When a user connects their calendar:

1. User clicks "Connect Calendar" button
2. Redirected to Nylas OAuth page
3. User authorizes access to their calendar
4. Nylas redirects back with authorization code
5. Server exchanges code for access token
6. Nylas returns a `grantId` (identifier for this connection)
7. Grant ID and email stored in user's database record
8. This grant ID used for all future calendar operations

When checking availability:

1. Booking page receives selected date
2. Server queries user's availability settings for that day of week
3. Server calls Nylas `getFreeBusy` API with:
   - Grant ID
   - Start and end of selected day
   - User's email
4. Nylas returns array of busy time slots
5. Server calculates available slots:
   - Generates all possible slots within working hours
   - Filters out busy times
   - Filters out past times
   - Ensures slot + duration doesn't conflict with busy periods
6. Available slots returned to frontend

When creating a booking:

1. User submits booking form
2. Server action receives: date, time, duration, participant info
3. Server constructs start/end DateTime objects
4. Server calls Nylas `events.create` API with:
   - Grant ID
   - Event title and description
   - Start/end times (Unix timestamps)
   - Video conferencing provider (Google Meet, Zoom, Teams)
   - Participant email and name
5. Nylas creates event in user's calendar
6. Nylas generates video conference link
7. Calendar invites sent to participants
8. User redirected to success page

### Availability Calculation Algorithm

The system uses a smart algorithm to determine available time slots:

```typescript
1. Get user's working hours for selected day (e.g., 9:00 - 17:00)
2. Get busy slots from Nylas for that day
3. Generate all possible slots:
   - Start from working hours start time
   - Create slots every [duration] minutes
   - Stop when slot end time exceeds working hours end time
4. Filter slots:
   - Remove slots in the past
   - Remove slots that overlap with busy times:
     * Slot starts during a busy period
     * Slot ends during a busy period  
     * Slot completely contains a busy period
5. Return remaining free slots
```

This ensures users can only book times when:
- It's during their working hours
- They're not already busy
- It's not in the past
- There's enough time for the full meeting duration

### Authentication & Authorization

**Authentication**
- Handled entirely by NextAuth
- Supports GitHub and Google OAuth
- Sessions stored in database via Prisma adapter
- Automatic session management

**Authorization**
- Server-side checks on all protected routes
- `authenticateUser()` hook throws if no session
- Client components can check auth status
- Public booking pages don't require authentication

**Route Protection**
- Dashboard routes: require authentication
- Booking pages: public (anyone can book)
- API routes: vary by endpoint
- Onboarding: requires authentication (new users only)

## Deployment

### Environment Variables

All environment variables listed in the installation section must be set in your production environment.

### Database

Ensure your production PostgreSQL database is accessible and run migrations:
```bash
npx prisma db push
```

### Recommended Platforms

- **Vercel** - Optimized for Next.js, easiest deployment
- **Railway** - Good for full-stack apps with database
- **Render** - Simple deployment with PostgreSQL support

### Post-Deployment Checklist

- [ ] Database migrations run successfully
- [ ] All environment variables set
- [ ] OAuth redirect URIs updated in provider settings
- [ ] Nylas redirect URI updated
- [ ] UploadThing domain configured
- [ ] Test authentication flow
- [ ] Test calendar connection
- [ ] Test booking flow end-to-end

## Future Enhancements

Potential features that could be added:

- Recurring event types
- Buffer time between meetings
- Custom booking forms with additional fields
- Email notifications for bookings
- Time zone detection and handling
- Multiple calendar support
- Team/organization features
- Analytics dashboard
- Custom branding/themes
- Integration with more video providers
- Mobile app

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License.

---

**Built with Next.js, TypeScript, and a lot of coffee ☕**

For questions, issues, or feature requests, please open an issue on GitHub.
