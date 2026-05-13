# 🌿 EcoVibe Backend

Node.js + Express + MongoDB REST API for the EcoVibe green product marketplace.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your values

# 3. Generate VAPID keys for push notifications
npx web-push generate-vapid-keys

# 4. Seed sample data (optional)
npm run seed

# 5. Start development server
npm run dev
```

---

## Tech Stack

| Layer | Tech |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh tokens) |
| File Uploads | Multer (local disk) |
| Push Notifications | Web Push (VAPID) |
| Validation | express-validator |
| Rate Limiting | express-rate-limit |

---

## Project Structure

```
src/
├── server.js              # Entry point
├── app.js                 # Express app + middleware setup
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   ├── user.model.js
│   ├── product.model.js
│   ├── post.model.js
│   ├── challenge.model.js
│   └── notification.model.js
├── controllers/           # Business logic
├── routes/                # Route definitions
├── middleware/
│   ├── auth.middleware.js  # JWT protect + role guard
│   ├── error.middleware.js
│   ├── upload.middleware.js
│   └── validate.middleware.js
└── utils/
    ├── jwt.js
    ├── push.js
    └── seed.js
```

---

## API Reference

Base URL: `http://localhost:5000/api`

All protected routes require: `Authorization: Bearer <accessToken>`

---

### 🔐 Auth  `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Register user (role: user \| seller) |
| POST | `/login` | No | Login, returns access + refresh tokens |
| POST | `/refresh` | No | Exchange refresh token for new tokens |
| POST | `/logout` | ✅ | Invalidate refresh token |
| GET | `/me` | ✅ | Get current user |

**Register body:**
```json
{ "name": "Alex", "email": "alex@example.com", "password": "secret123", "role": "user" }
```

**Login response:**
```json
{ "accessToken": "...", "refreshToken": "...", "user": { ... } }
```

---

### 👤 Users  `/api/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/leaderboard` | No | Top 20 users by eco score |
| GET | `/:id` | No | Get user profile |
| PUT | `/me` | ✅ | Update profile (multipart: avatar) |
| POST | `/:id/follow` | ✅ | Toggle follow/unfollow |
| GET | `/:id/posts` | No | User's posts (paginated) |
| GET | `/:id/products` | No | Seller's products |
| POST | `/me/saved/:productId` | ✅ | Toggle save product |
| GET | `/me/saved` | ✅ | Get saved products |

---

### 🛍️ Products  `/api/products`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | List/search products |
| GET | `/:id` | No | Get product detail |
| POST | `/` | ✅ Seller | Create product (multipart: images[]) |
| PUT | `/:id` | ✅ Owner | Update product |
| DELETE | `/:id` | ✅ Owner | Delete product |
| POST | `/:id/like` | ✅ | Toggle like |
| POST | `/:id/reviews` | ✅ | Add review |

**Query params for GET /products:**
- `q` — full-text search
- `category` — food-beverage | clothing | home-living | beauty-personal-care | electronics | outdoors | education | other
- `ecoTag` — filter by tag (organic, zero-waste, etc.)
- `minPrice`, `maxPrice`
- `isEcoVerified=true`
- `sort` — newest | oldest | price-asc | price-desc | rating | popular
- `page`, `limit`

---

### 📣 Posts (Feed)  `/api/posts`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | Global feed (paginated) |
| GET | `/following` | ✅ | Feed from followed users |
| GET | `/:id` | No | Single post |
| POST | `/` | ✅ | Create post (multipart: images[]) |
| DELETE | `/:id` | ✅ Owner | Delete post |
| POST | `/:id/like` | ✅ | Toggle like |
| POST | `/:id/comments` | ✅ | Add comment |
| DELETE | `/:id/comments/:commentId` | ✅ Owner | Delete comment |

**Create post body (multipart/form-data):**
- `content` (required) — supports #hashtags parsed automatically
- `images[]` — up to 4 images
- `taggedProduct` — product ObjectId
- `taggedChallenge` — challenge ObjectId
- `ecoImpact` — JSON string `{ "carbonSaved": 1.5, "description": "..." }`

---

### 🏆 Challenges  `/api/challenges`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | List challenges |
| GET | `/:id` | No | Challenge detail |
| POST | `/` | ✅ | Create challenge (multipart: image) |
| DELETE | `/:id` | ✅ Creator | Delete challenge |
| POST | `/:id/join` | ✅ | Toggle join/leave |
| PUT | `/:id/progress` | ✅ | Update progress (auto-completes at 100%) |

**Query params for GET /challenges:**
- `category` — zero-waste | plant-based | energy-saving | water-saving | transport | shopping | other
- `difficulty` — easy | medium | hard
- `active=true`, `featured=true`

**Update progress body:**
```json
{ "progress": 75, "proofPost": "<postId>" }
```
Auto-awards eco points + badge + push notification on 100%.

---

### 🔔 Notifications  `/api/notifications`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/vapid-public-key` | No | VAPID public key for frontend |
| GET | `/` | ✅ | Get notifications (with unreadCount) |
| PUT | `/read-all` | ✅ | Mark all as read |
| PUT | `/:id/read` | ✅ | Mark one as read |
| POST | `/subscribe` | ✅ | Save push subscription |
| DELETE | `/subscribe` | ✅ | Remove push subscription |
| POST | `/send-test` | ✅ | Send a test push |

**Push subscription body:**
```json
{ "endpoint": "https://fcm.googleapis.com/...", "keys": { "p256dh": "...", "auth": "..." } }
```

---

## Data Models

### User
- `name`, `email`, `password` (hashed), `avatar`, `bio`, `location`
- `ecoScore`, `badges[]`, `carbonSaved`, `treesPlanted`
- `followers[]`, `following[]`, `savedProducts[]`
- `role`: user | seller | admin
- `pushSubscriptions[]`

### Product
- `name`, `description`, `price`, `images[]`, `category`
- `ecoTags[]`, `certifications[]`, `carbonFootprint`, `isEcoVerified`, `recyclable`
- `reviews[]` → `averageRating`, `numReviews`
- `likes[]`, `likesCount`, `stock`

### Post
- `content`, `images[]`, `hashtags[]`
- `taggedProduct`, `taggedChallenge`
- `ecoImpact` → `carbonSaved`, `wasteReduced`, `description`
- `likes[]`, `comments[]`

### Challenge
- `title`, `description`, `category`, `difficulty`, `durationDays`
- `startDate`, `endDate`, `ecoPointsReward`, `badgeReward`
- `participants[]` → `progress`, `completed`, `proofPost`

### Notification
- `type`: follow | like_post | comment | challenge_completed | eco_badge | system | ...
- `title`, `body`, `isRead`, `ref` (polymorphic reference)

---

## Roles & Permissions

| Action | user | seller | admin |
|--------|------|--------|-------|
| Create product | ❌ | ✅ | ✅ |
| Create post | ✅ | ✅ | ✅ |
| Create challenge | ✅ | ✅ | ✅ |
| Delete any content | ❌ | ❌ | ✅ |
| Delete own content | ✅ | ✅ | ✅ |

---

## Environment Variables

See `.env.example` for all variables.

Generate VAPID keys:
```bash
npx web-push generate-vapid-keys
```
