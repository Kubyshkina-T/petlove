# 🐾 PetLove

PetLove is a responsive web application designed to help people find pets for adoption, explore animal-related news, and connect with organizations that care for animals.

The application allows users to browse pet listings, search and filter available animals, save favorite pets, and manage their personal profiles.

## 🚀 Technologies

- **Next.js** — React framework with App Router
- **React** — user interface development
- **TypeScript** — type-safe JavaScript
- **CSS Modules** — component styling and responsive layouts
- **React Hook Form** — form management
- **Yup** — form validation
- **React Hot Toast** — user notifications
- **REST API** — communication with the backend

## ✨ Features

- Responsive design for mobile, tablet, and desktop devices
- User registration, login, and logout
- User profile management
- Adding and removing pets from a personal profile
- Browsing pet listings
- Filtering and searching for pets
- Adding and removing pets from favorites
- Viewing previously opened pet listings
- Browsing news and partner organizations
- Pagination
- Modal windows for user interactions
- Form validation and error handling
- Loading indicators

## 🎨 Design

The interface is implemented according to the provided Figma design, with layouts adapted for mobile, tablet, and desktop screens.

**Figma design:** [Add Figma design link]

## 📋 Technical Specification

The application was developed according to the project requirements, including component structure, navigation, authentication, API integration, form validation, and responsive design.

**Technical specification:** [Add technical specification link]

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
PETLOVE_API_URL=https://petlove.b.goit.study/api
```

### 4. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## 📁 Project Structure

```text
src/
├── app/          # Application routes and API handlers
├── components/   # Reusable UI components
└── types/        # TypeScript types

public/           # Images, icons, and static assets
```

## 🔐 Authentication

PetLove uses cookie-based authentication. Protected functionality, including profile management, favorites, and adding pets, is available to authenticated users.

## 👩‍💻 Author

**Tetiana Kubyshkina**

GitHub: https://github.com/Kubyshkina-T
