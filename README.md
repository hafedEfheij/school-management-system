# School Management System

A comprehensive solution for managing students, teachers, courses, and more. This application is built with Next.js and supports multiple languages (Arabic, English, and French) with full RTL support.

## Features

- **Multilingual Support**: Arabic (RTL), English (LTR), and French (LTR)
- **RTL Support**: Full right-to-left support for Arabic language
- **Internationalized Formatting**: Dates, numbers, and currencies are formatted according to the selected language
- **Authentication**: User authentication with role-based access control
- **Student Management**: Add, edit, view, and delete students
- **Teacher Management**: Manage teacher profiles and assignments
- **Course Management**: Create and manage courses and educational resources
- **Schedule Management**: Organize and track class schedules and events

## Tech Stack

- **Frontend**: Next.js (React)
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL with Supabase

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/hafedEfheij/school-management-system.git
cd school-management-system
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Internationalization

### Language Selection

The application supports three languages:
- Arabic (RTL)
- English (LTR)
- French (LTR)

Users can switch between languages using the language switcher in the header. The selected language is stored in localStorage for persistence.

### Adding New Languages

To add a new language:

1. Update the `Language` type in `src/contexts/LanguageContext.tsx`:

```typescript
export type Language = 'ar' | 'en' | 'fr' | 'new-language-code';
```

2. Add the language to the `localeMap`:

```typescript
const localeMap: Record<Language, string> = {
  ar: 'ar-SA',
  en: 'en-US',
  fr: 'fr-FR',
  'new-language-code': 'locale-code',
};
```

3. Add translations for the new language in the `translations` object.

4. Update the LanguageSwitcher component to include the new language.

### RTL Support

The application automatically handles RTL layout for Arabic language. The `useRtl` hook provides utility functions for RTL-aware styling:

```typescript
const rtl = useRtl();

// Example usage
<div className={rtl.margin('left', 4)}>
  <span className={rtl.textAlign()}>Text</span>
</div>
```

## Demo

Visit the `/demo` page to see a demonstration of the internationalization features, including:

- Variable substitution
- Date formatting
- Number formatting
- Currency formatting
- Relative time formatting
- RTL support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
