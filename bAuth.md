\# Better Auth Migration Instructions



\## Objective



Completely remove NextAuth and replace it with Better Auth using a clean, scalable, production-ready architecture for a modern Next.js App Router application.



The migration must prioritize:



\- fast authentication

\- reliable login/logout

\- clean middleware handling

\- scalable auth architecture

\- instant UI updates

\- proper protected routes

\- no stale sessions

\- no hydration mismatch

\- optimized App Router compatibility



\---



\# CRITICAL REQUIREMENTS



\## IMPORTANT



Do NOT patch or partially reuse old NextAuth logic.



Completely remove all legacy auth-related code before implementing Better Auth.



The application must not contain any leftover:



\- NextAuth providers

\- session hooks

\- session providers

\- auth callbacks

\- JWT callbacks

\- middleware checks

\- API routes

\- auth utilities

\- stale cookies

\- auth wrappers

\- server session handlers



\---



\# REMOVE ALL NEXTAUTH



Delete and remove:



\- next-auth package

\- auth.ts

\- authOptions

\- SessionProvider

\- useSession

\- getServerSession

\- signIn

\- signOut

\- middleware.ts auth logic

\- api/auth/\[...nextauth]

\- all next-auth imports

\- next-auth callbacks

\- JWT/session callbacks

\- NextAuth environment variables



Also remove all unused auth helper functions.



\---



\# INSTALL BETTER AUTH



Install and configure Better Auth using modern App Router architecture.



Use:



\- Better Auth

\- Prisma or existing ORM

\- secure cookie sessions

\- production-safe configuration



\---



\# AUTHENTICATION FEATURES REQUIRED



Implement:



\## Email \& Password Authentication



\- signup

\- login

\- logout

\- session persistence



\---



\# ROUTE PROTECTION



Protect authenticated routes properly.



Examples:



\- dashboard

\- admin

\- account

\- profile



Unauthenticated users must instantly redirect to login.



Authenticated users should not access login/signup pages unnecessarily.



\---



\# LOGIN / LOGOUT REQUIREMENTS



The new auth system must:



\- login instantly

\- logout instantly

\- fully clear session state

\- fully clear auth cookies

\- prevent stale dashboard access

\- prevent browser back access after logout

\- sync auth state properly across refreshes



\---



\# SESSION REQUIREMENTS



Avoid:



\- stale sessions

\- delayed hydration

\- double session fetching

\- unnecessary API calls

\- client/server mismatch



Use lightweight and reliable session handling.



\---



\# MIDDLEWARE REQUIREMENTS



Middleware must:



\- be fast

\- avoid redirect loops

\- avoid unnecessary database lookups

\- properly validate auth state

\- work correctly with App Router



\---



\# UI REQUIREMENTS



Update all authentication UI:



\- login form

\- signup form

\- logout button

\- protected navigation

\- auth redirects



Ensure UI updates immediately after login/logout.



\---



\# CODE QUALITY REQUIREMENTS



Architecture must be:



\- scalable

\- production-ready

\- modular

\- clean

\- typed properly

\- App Router friendly



Avoid messy auth abstractions.



\---



\# PERFORMANCE REQUIREMENTS



Optimize for:



\- fast navigation

\- fast auth checks

\- minimal rerenders

\- minimal network calls

\- efficient session validation



\---



\# FINAL VERIFICATION REQUIRED



After migration verify:



\## Authentication Flow



\- signup works

\- login works

\- logout works

\- refresh works

\- protected routes work

\- middleware works

\- redirects work

\- cookies clear properly

\- browser back button cannot access dashboard after logout



\---



\# IMPORTANT OUTPUT REQUIREMENT



After completing migration:



1\. Show all modified files

2\. Explain architecture briefly

3\. Explain middleware flow

4\. Explain session flow

5\. Explain how logout invalidation works

6\. Identify any remaining manual work if needed



\---



\# TARGET RESULT



The final authentication system should feel:



\- instant

\- modern

\- scalable

\- reliable

\- production-grade



similar to high-quality SaaS applications.

