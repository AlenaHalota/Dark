# Business Requirements Document (BRD)

## Project Title: Dark Reel (Horror Movie Database)
**Document Version:** 1.1  
**Date:** August 5, 2026  
**Project Lead:** System Architect / QA Lead  

---

## 1. Executive Summary & Objectives

**Dark & Shady** is a dedicated web application designed for horror cinema enthusiasts. It allows users to track, rate, review, and search horror movies through a modern, atmospheric dark UI. 

### Key Objectives
* Deliver an intuitive single-page web application within AWS Free Tier limits.
* Support core CRUD operations for movie catalog management and user reviews.
* Establish a robust technical foundation using serverless architecture and automated end-to-end testing.
* Phase technical evolution gracefully across two releases (MVP vs. Phase 2 Expansion).

---

## 2. Project Scope & Phased Architecture

```
                       ┌────────────────────────────────────────┐
                       │          Phase 1: Foundation           │
                       │ ─── ─── ─── ─── ─── ─── ─── ─── ─── ───│
                       │ • Public Movie Database (CRUD)         │
                       │ • Search, Filter & Ratings             │
                       │ • Dark / Horror Theme UI               │
                       │ • Serverless Infra (AWS Free Tier)     │
                       └───────────────────┬────────────────────┘
                                           │
                                           ▼
                       ┌────────────────────────────────────────┐
                       │          Phase 2: Enhancements         │
                       │ ─── ─── ─── ─── ─── ─── ─── ─── ─── ───│
                       │ • External API (Upcoming Releases)     │
                       │ • Social Auth (Google / Facebook)      │
                       │ • Favorite Tagging & Watchlists        │
                       │ • User-bound Reviews & Personalization│
                       └────────────────────────────────────────┘
```

---

## 3. Functional Requirements

### Phase 1 (MVP)

#### FR-1: Movie Management (CRUD)
* **Add Movie:** Users can submit new horror entries with the following attributes:
  * Title (*required*)
  * Sub-genre (*e.g., Slasher, Supernatural, Psychological, Body Horror, Found Footage*)
  * Release Year (*required*)
  * Director & Main Cast
  * Rating (*1–10 numerical scale or half-star increment*)
  * Personal Review / Notes (*rich text or markdown*)
* **View Movie:** Detailed view card presenting poster artwork, metadata, rating, and user review.
* **Edit/Delete Movie:** Ability to update entry metadata or remove entries from the database.

#### FR-2: Search & Filtering
* **Real-time Search:** Search by title, director, or keywords in reviews.
* **Multi-criteria Filtering:** Filter catalog by:
  * Sub-genre
  * Release Year / Decade
  * Rating range (*e.g., 8+ stars only*)
* **Sorting:** Sort catalog by *Recently Added*, *Highest Rated*, or *Release Date*.

#### FR-3: User Interface & Theme
* **Visual Style:** Modern, minimalist dark aesthetic with horror-inspired accents (e.g., deep charcoal background, subtle crimson/blood-red highlights, sleek typography).
* **Usability:** Fully responsive layout (Mobile, Tablet, Desktop) with card-based grid displays.

---

### Phase 2 (Future Scope)

#### FR-4: Upcoming Releases API Integration
* Integration with an external movie database API (e.g., **TMDB API**) to fetch upcoming horror movie release schedules.
* Dedicated "Coming Soon" dashboard showing release dates, trailers, and hype indicators.

#### FR-5: User Authentication & Authorization
* **OAuth 2.0 Integration:** Login via **Google** and **Facebook** powered by **AWS Cognito**.
* **User Session Management:** Restrict editing and review deletion rights to the content owner.

#### FR-6: Favorites & Watchlist Management
* **Favorite Tagging:** Users can mark movies as "Favorites" (quick-toggle heart/star icon) for quick access and quick filtering across their profile.
* **Watchlist Tracking:** Dedicated "Watchlist" feature enabling logged-in users to save movies they plan to watch, track watch status (e.g., *Plan to Watch*, *Watching*, *Completed*), and filter catalog views by their personal list.
* **Personalized Dashboard:** Custom views for user-specific collections, favorite lists, and personal review history.

---

## 4. Technical Architecture & Tech Stack

```
   ┌────────────────┐      ┌─────────────────┐      ┌──────────────────────────┐
   │ React Frontend │ ───> │ AWS API Gateway │ ───> │ AWS Lambda (Node.js REST)│
   └────────────────┘      └─────────────────┘      └────────────┬─────────────┘
                                                                 │
                                                                 ▼
                                                        ┌──────────────────┐
                                                        │ AWS DynamoDB     │
                                                        └──────────────────┘
```

| Layer | Technology | Infrastructure / Hosting |
| :--- | :--- | :--- |
| **Frontend Framework** | React (Vite / Next.js SPA) | AWS Amplify or S3 Static Hosting + CloudFront |
| **Backend Runtime** | Node.js (Express / Serverless Framework) | AWS Lambda |
| **API Layer** | REST Protocol | AWS API Gateway (HTTP API) |
| **Database** | DynamoDB (NoSQL Key-Value Store) | AWS DynamoDB (On-Demand / Provisioned Free Tier) |
| **Authentication (P2)** | AWS Cognito + OAuth 2.0 | Google & Facebook Identity Providers |
| **Automated Testing** | Playwright | CI/CD Pipeline (GitHub Actions) |

---

## 5. Non-Functional Requirements & Constraints

### Cost & Cloud Guardrails (AWS Free Tier)
* **AWS Lambda:** Kept well within 1,000,000 free requests/month and 3.2M seconds of compute time.
* **AWS DynamoDB:** Configured within 25 GB of storage and 25 provisioned WCU/RCU (or Pay-per-request throttled).
* **Latency:** Cold start optimization on Lambda (minimal dependencies, lightweight bundling).

### Quality Assurance & Automated Testing (Playwright)
* **E2E Test Coverage:**
  * End-to-end user journeys for creating, filtering, searching, and deleting a movie entry.
  * User interaction tests for marking favorites and managing watchlists (Phase 2).
  * Theme rendering and responsive design layout tests.
* **Integration Testing:** API endpoint contract testing via Playwright API request context.
* **Mocking:** API mocking for third-party releases API (Phase 2) during pipeline execution.

---

## 6. Proposed DynamoDB Schema Design (Single-Table Strategy)

```
Table Name: DarkReel_Main

Primary Key Structure:
  • Partition Key (PK): ENTITY_TYPE (e.g., "MOVIE", "USER#123")
  • Sort Key (SK): ENTITY_ID (e.g., "MOVIE#uuid", "REVIEW#uuid", "FAVORITE#movieId", "WATCHLIST#movieId")

Attributes:
  • MovieId (String)
  • UserId (String)
  • Title (String)
  • SubGenre (String)
  • ReleaseYear (Number)
  • Rating (Number)
  • ReviewText (String)
  • Status (String - e.g., "Plan to Watch", "Completed")
  • CreatedAt (ISO Timestamp)
```

> **GSI-1 (Global Secondary Index for User Lists & Filtering):**  
> `GSI1-PK`: `USER#<userId>` | `GSI1-SK`: `LIST_TYPE#<Favorite|Watchlist>`

---

## 7. Success Criteria & Deliverables

* **Deliverable 1:** Deployed React single-page app meeting the dark horror aesthetic guidelines.
* **Deliverable 2:** Serverless backend REST API deployed via AWS CloudFormation / SAM / Serverless Framework.
* **Deliverable 3:** Support for user authentication, favorite tagging, and watchlist management in Phase 2.
* **Deliverable 4:** Automated Playwright test suite passing with >85% critical path coverage in CI/CD.
* **Deliverable 5:** Zero cost incurred during standard non-production operation (within Free Tier limits).
