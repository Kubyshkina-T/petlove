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

**Figma design:** https://www.figma.com/design/puMNfZVg4YI8UZoJ1QiLLi/Petl%F0%9F%92%9Bve?node-id=0-1&p=f&t=NHfYHiqJXbyPgAnJ-0

## 📋 Technical Specification

The application was developed according to the project requirements, including component structure, navigation, authentication, API integration, form validation, and responsive design.

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
PETLOVE_API_URL=your_backend_api_url
```

### 4. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## 📁 Project Structure

```text
petlove/
├── app/          # Application routes and API handlers
├── components/   # Reusable UI components
├── types/        # TypeScript types
├── public/       # Images, icons, and static assets
├── package.json
└── README.md
```

## 🔐 Authentication

PetLove uses cookie-based authentication. Protected functionality, including profile management, favorites, and adding pets, is available to authenticated users.

## 👩‍💻 Author

**Tetiana Kubyshkina**

GitHub: https://github.com/Kubyshkina-T
