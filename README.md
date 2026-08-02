# Tigo

Tigo is a Medium-style publishing platform: a React single-page app backed by a
Spring Boot REST API, with Google sign-in and Postgres persistence via Neon.
People write and publish posts with a block-based rich text editor, follow
tags/categories, clap for and comment on stories, and manage their own
library, drafts, and stats.

## Monorepo layout

```
Tigoo/
├── tigo-frontend/   React 19 + Vite SPA
└── tigo-backend/    Spring Boot 4 REST API
```

## Tech stack

**Frontend** (`tigo-frontend/`)
- React 19, React Router 7, Vite 8
- Tailwind CSS 4 (`@tailwindcss/vite`, `@tailwindcss/typography`)
- Editor.js (`@editorjs/editorjs` + header/list/quote/code/image plugins) for
  the block-based post editor, rendered to HTML via `editorjs-html` and
  sanitized with `dompurify`
- Axios for API calls, `react-hot-toast` for notifications, `framer-motion`
  for animation, `lucide-react` for icons
- `@neondatabase/auth` (Better Auth adapter) for Google OAuth sign-in

**Backend** (`tigo-backend/`)
- Spring Boot 4.1, Java 21
- Spring Web MVC, Spring Data JPA/Hibernate, Bean Validation
- Spring Security as an OAuth2 resource server — validates JWTs issued by
  Neon Auth. Neon's JWKS uses Ed25519 (OKP) keys, so a custom `JWTProcessor`
  in `SecurityConfig` verifies signatures directly with Nimbus's
  `Ed25519Verifier` (Bouncy Castle + Google Tink) instead of the default key
  converter, which doesn't support OKP keys
- PostgreSQL (hosted on Neon) as the datastore
- Lombok, `dotenv-java` for local `.env` loading

## Features

- **Feed & discovery** — home feed of published posts, filterable by category
  or tag (`/`, `/tag/:slug`)
- **Reading a post** — full post view with author card, clap (like) counts,
  and threaded comments (`/post/:slug`)
- **Writing** — block-based editor (headers, lists, quotes, code, images)
  with a publish modal for setting status/visibility (`/write`, auth
  required)
- **Stories management** — a writer's own posts split into Drafts, Scheduled,
  Published, Unlisted, and Submissions tabs (`/stories`)
- **Library** — saved lists, reading history, highlights, and responses
  (`/library`)
- **Profile** — public profile with About, Activity, and Reposts tabs
  (`/profile/:userId`)
- **Stats** — a writer's dashboard for their own posts (`/stats`)
- **Recommendations** — following/muted/suggestions tabs to refine the feed
  (`/me/following`)
- **Auth** — Google sign-in via Neon Auth; the backend syncs the signed-in
  Google identity into a local `User` row on first authenticated request

## Data model (backend)

`User`, `Post` (with `PostStatus`: `DRAFT` | `PUBLISHED`), `Category`, `Tag`,
`Comment`, `Clap` — see `tigo-backend/src/main/java/com/tigo/entity/`.

## REST API

All endpoints are rooted at `/api`. Routes are public for anonymous reads
(category list, `GET` post/feed endpoints); everything else requires a valid
bearer JWT (see `SecurityConfig`).

| Method | Path | Description |
|---|---|---|
| GET | `/api/users/me` | Sync the authenticated Google identity to a local user and return it |
| GET | `/api/posts` | Paginated feed, optional `categoryId` / `tagSlug` filters |
| POST | `/api/posts` | Create a post (auth required) |
| GET | `/api/posts/{slug}` | Get a post by slug |
| PATCH | `/api/posts/{id}` | Update a post (author only) |
| DELETE | `/api/posts/{id}` | Delete a post (author only) |
| GET | `/api/posts/user/{userId}` | Paginated posts by a given user |
| GET | `/api/posts/{postId}/comments` | List comments on a post |
| POST | `/api/posts/{postId}/comments` | Add a comment (auth required) |
| DELETE | `/api/posts/{postId}/comments/{commentId}` | Delete a comment (author only) |
| GET | `/api/posts/{postId}/claps` | Get clap count / current user's clap status |
| POST | `/api/posts/{postId}/claps` | Add claps to a post (auth required) |
| GET | `/api/categories` | List all categories |

## Running locally

### Prerequisites
- Node.js 18+ and npm
- Java 21 and Maven (or use the bundled `mvnw`)
- A Neon Postgres database and a Neon Auth project (for Google OAuth + JWKS)

### Backend

```bash
cd tigo-backend
```

Create a `.env` (loaded automatically via `dotenv-java`) with:

```
NEON_JDBC_URL=jdbc:postgresql://<host>/<db>?sslmode=require
NEON_DB_USERNAME=<username>
NEON_DB_PASSWORD=<password>
PORT=8081
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

The Neon Auth JWKS URL is currently hardcoded in
`src/main/resources/application.properties`
(`spring.security.oauth2.resourceserver.jwt.jwk-set-uri`) — update it if you
point at a different Neon Auth project. `spring.jpa.hibernate.ddl-auto` is
set to `validate`, so the schema must already exist (via migrations or a
prior `create`/`update` run) before starting the app.

Run it:

```bash
./mvnw spring-boot:run
```

The API starts on `http://localhost:8081` by default.

### Frontend

```bash
cd tigo-frontend
npm install
```

Create a `.env` with:

```
VITE_API_BASE_URL=http://localhost:8081
VITE_NEON_AUTH_BASE_URL=<your Neon Auth base URL>
```

Run it:

```bash
npm run dev      # start the Vite dev server (http://localhost:5173)
npm run build    # production build
npm run preview  # preview the production build
npm run lint     # eslint
```
