# 🏰 Haven Luxury Estates

<p align="center">
  <strong>A Premier Modern Luxury Real Estate Marketplace & Brokerage Management Platform</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel 12" />
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Inertia.js-v3-9553E9?style=for-the-badge&logo=inertia&logoColor=white" alt="Inertia.js v3" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Pest_PHP-v3-FF8000?style=for-the-badge&logo=php&logoColor=white" alt="Pest PHP" />
</p>

---

## 🌟 Overview

**Haven Luxury Estates** is a full-stack, enterprise-grade real estate platform built with **Laravel 12**, **Inertia.js v3**, and **React 19**. It delivers an ultra-refined, high-performance experience tailored for high-end luxury properties, private estates, penthouses, and beachfront sanctuaries.

The platform provides a public catalog and client inquiry portal alongside a dedicated, role-isolated **Admin Control Center** for listing managers and brokerage directors.

---

## ✨ Key Features

### 🏡 Public Property Marketplace
- **40+ Curated Flagship Properties**: High-resolution galleries, architectural specifications, price structures (Sales & Monthly Executive Rentals), video tours, and amenity badges.
- **Interactive Multi-Filter Discovery**: Search by keyword, property category, price bracket, bedroom/bathroom count, price type (Sale vs. Rent), and sorting order.
- **Detailed Property Overviews**: Geo-coordinate coordinates, agent contact cards, mortgage calculators, showing appointment booking, and direct offer submissions.

### 👤 Client & Buyer Experience
- **Showing & Tour Booking**: Instant scheduling requests with preferred dates, automated inquiry history tracking, and agent status updates (`New`, `Contacted`, `Resolved`).
- **Saved Bookmarks**: One-click bookmarking of favorite properties with a dedicated `/saved-properties` dashboard.
- **Client Profile & Preferences**: Customize buyer notes, target budgets, and direct phone contact for seamless tour confirmations.
- **Intended URL Navigation**: Clients logging in from a listing page are automatically returned back to the exact property they were viewing.

### 🛡️ Admin & Brokerage Control Center
- **Property Management (CRUD)**: Create, edit, feature, and manage luxury listings with dynamic multi-image galleries, amenity tagging, and geolocation mapping.
- **Property Types & Architectural Styles**: Organize portfolios by customizable property types (Luxury Villas, Penthouses, Mountain Chalets, Historic Manors, etc.).
- **Lead & Inquiry CRM**: Review incoming client showing requests, filter by status and inquiry type, record internal administrative notes, and track resolution lifecycles.
- **User & Agent Governance**: Manage registered users and assign permissions across `admin`, `agent`, and `user` roles.
- **Strict Role Isolation**: Administrative controls and sidebars are completely quarantined from regular client and guest views.

### 🔒 Enterprise Security & Fortify Auth
- **Role-Aware Post-Login Redirection**: Administrators automatically route directly to the `/admin` control center, while clients return to their intended browsing page or home (`/`).
- **Two-Factor Authentication (2FA)** & Secure Password Management.
- **Rate-Limiting & CSRF Protection**.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend Framework** | [Laravel 12](https://laravel.com/) (PHP 8.4) |
| **Authentication Engine** | [Laravel Fortify](https://laravel.com/docs/fortify) |
| **SPA Architecture** | [Inertia.js v3](https://inertiajs.com/) |
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Typed Routing** | [Laravel Wayfinder](https://github.com/lepikhinb/wayfinder) |
| **Testing Suite** | [Pest PHP](https://pestphp.com/) (76+ Feature & Auth Tests) |
| **Code Formatter** | [Laravel Pint](https://laravel.com/docs/pint) |

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- **PHP 8.4+** with SQLite / MySQL extension
- **Composer 2.x**
- **Node.js 20+** & **NPM**

### 2. Clone and Setup Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/haven-luxury-estates.git
cd haven-luxury-estates

# Install PHP dependencies
composer install

# Install Frontend dependencies
npm install
```

### 3. Environment & Database Configuration
```bash
# Copy the environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run database migrations and seed full dataset (40 properties, demo users, inquiries)
php artisan migrate:fresh --seed
```

### 4. Build Frontend Assets
```bash
# Development mode with hot module replacement
npm run dev

# Or compile production assets
npm run build
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Area |
| :--- | :--- | :--- | :--- |
| **Admin Executive** | `admin@example.com` | `password` | Full `/admin` Control Center & CRM |
| **Luxury Agent** | `agent1@example.com` | `password` | Agent Profile & Assigned Listings |
| **Private Client** | `user@example.com` | `password` | Client Portal, Saved Bookmarks, Inquiries |

---

## 🧪 Running Tests

The application is thoroughly tested with Pest PHP:

```bash
# Run the complete test suite
php artisan test --compact

# Run specific test suites
php artisan test --compact --filter=AdminPropertyTest
php artisan test --compact --filter=AuthenticationTest
```

---

## 📂 Project Structure

```
haven-luxury-estates/
├── app/
│   ├── Actions/Fortify/          # Fortify user creation & reset actions
│   ├── Http/
│   │   ├── Controllers/          # Property, Enquiry, Admin, and User Controllers
│   │   ├── Middleware/           # Role verification & Admin middleware
│   │   └── Responses/            # Role-aware Login & Register responses
│   └── Models/                   # Property, PropertyType, Enquiry, SavedProperty, User
├── config/                       # App, Database, Fortify, and Inertia config
├── database/
│   ├── migrations/               # Database schemas
│   └── seeders/                  # DatabaseSeeder (40 properties, 8 types, CRM leads)
├── resources/
│   ├── js/
│   │   ├── components/           # UI components, PropertyCards, FilterBar, Dialogs
│   │   ├── layouts/              # GuestLayout, AppLayout (Admin), SettingsLayout
│   │   └── pages/                # Inertia pages (Welcome, Properties, Admin, User)
│   └── css/                      # Tailwind CSS v4 stylesheets
├── routes/                       # Web & Admin route definitions
└── tests/
    └── Feature/                  # Feature and integration test suites
```

---

## 📄 License

This open-source project is licensed under the [MIT license](LICENSE).
