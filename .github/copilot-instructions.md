# 🧭 Astro Framework: Best Practices Instructions (for GitHub Copilot — Food Inventory Project)

> This guide is tailored for building a **Food Inventory Management** application using the Astro framework. It helps GitHub Copilot generate code that is modular, accessible, and optimized for web and mobile use cases involving tracking pantry, fridge, and freezer items, as well as recipe integration.


> Use these best practices to guide GitHub Copilot when generating code in an Astro project. This ensures clean, scalable, and production-grade output.

Technologies used...

- Astro Framework
- Tailwind CSS
- PostgreSQL
- TypeScript
- Zod for validation
- Vitest for testing
- Playwright for end-to-end testing
- @astrojs/image for optimized images
- @astrojs/tailwind for styling


## ⚙️ Project Structure

- Use the default Astro file-based routing (`/src/pages`) for page components.
- Organize components in `/src/components`, grouped by type or feature (`/ui`, `/layout`, `/features`).
- Create reusable layouts in `/src/layouts` and import via `layout:` frontmatter.
- Use `/src/content` with `@astro/content` collections for structured content when possible.

## 🧼 Code Style

- Prefer `.astro` components for template-heavy files, and `.ts/.js` for logic-heavy utilities.
- Always include frontmatter even if unused (`---\n---`) for consistency.
- Use `style scoped` blocks to avoid global CSS pollution.
- Use single quotes (`'`) and trailing commas per Prettier standards.

```astro
---
const title = 'Welcome';
---
<html lang="en">
```

## 📦 Component Composition

- Keep components small and reusable. One component = one concern.
- Use slots for flexible content injection.
- Use `is:client` directives **only when necessary** (hydrate only what you need).
- Memoize expensive client-side computations or side effects using `useEffect` or `useMemo` in React/Vue/Svelte components.

```astro
<!-- Example of partial hydration -->
<InteractiveCard client:load />
```

## 🌐 Styling

- Prefer `tailwindcss` or scoped styles within `.astro` files.
- Avoid global styles unless setting base typography or utility classes.
- Use utility-first CSS with Tailwind or minimal CSS Modules.

## 🛠️ Data Handling

- Prefer static content and prerendered pages.
- Use `fetch()` in Astro frontmatter for SSR; use `Astro.fetchContent()` when working with local markdown content.
- Validate dynamic props and API responses defensively.

```ts
// Example: Server-side data fetching
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/data');
  const data = await res.json();
  return { props: { data } };
}
```

## 🧪 Testing & Performance

- Use [Vitest](https://vitest.dev/) for unit tests, [Playwright](https://playwright.dev/) for end-to-end tests.
- Optimize image usage with `<Image />` from `@astrojs/image`.
- Audit bundle size with `astro build --verbose` and reduce unnecessary JS.

## 🔐 Accessibility & SEO

- Always include semantic HTML (`<main>`, `<nav>`, `<header>`, etc.).
- Set descriptive page titles and meta tags with `<Astro.head>` or `SEO` components.
- Ensure keyboard navigation and screen-reader accessibility on interactive components.

## 🧳 Deployment & Configuration

- Use environment variables securely via `.env` and `Astro.env`.
- Configure adapters correctly for deployment targets (e.g., `@astrojs/vercel`, `@astrojs/netlify`).
- Set caching and prerendering policies in `astro.config.mjs` or per-page frontmatter.

---

## ✨ Copilot Usage Notes

- Copilot should **generate Astro components using `.astro` syntax**, not just JSX or raw HTML.
- Prefer `client:load` or `client:visible` over `client:only` unless strictly needed.
- Encourage code comments and type annotations (`.ts`) for maintainability.

## 🎨 Tailwind CSS Integration

- Configure Tailwind in `astro.config.mjs` using `@astrojs/tailwind` integration.
- Use utility classes directly in `.astro` files to minimize CSS bloat.
- Apply responsive design principles using Tailwind's breakpoint utilities (`sm:`, `md:`, etc.).
- Extend theme in `tailwind.config.js` instead of overriding.
- Use Tailwind plugins (e.g., `@tailwindcss/typography`) for common design patterns.

```bash
# Install Tailwind in Astro
npm install -D tailwindcss
npx tailwindcss init
```

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 🛢️ PostgreSQL Integration

- Use `pg` or `drizzle-orm` for direct SQL interaction within Astro SSR APIs.
- Keep database queries in a separate module (`/src/lib/db.ts`) for reusability.
- Use environment variables for DB credentials, e.g. `PGHOST`, `PGUSER`, `PGPASSWORD`.
- Avoid exposing DB operations to the client side — use Astro server code or endpoints.
- Ensure proper connection handling and closing.

```ts
// Example: src/lib/db.ts
import { Pool } from 'pg';
const pool = new Pool({
  connectionString: import.meta.env.DATABASE_URL,
});
export const query = (text, params) => pool.query(text, params);
```

```ts
// Example usage in API route
import { query } from '../../lib/db.ts';

export async function get({ params }) {
  const { rows } = await query('SELECT * FROM users WHERE id = $1', [params.id]);
  return new Response(JSON.stringify(rows[0]), { status: 200 });
}
```

## 🥫 Food Inventory Domain Modeling

- Define core types such as `Item`, `Location`, `Recipe`, `Ingredient`, and `UserPreferences` in TypeScript.
- Store inventory in a PostgreSQL database with normalized tables for `items`, `locations`, `recipes`, and `ingredients`.
- Track `quantity`, `expirationDate`, `location`, and `lastUpdated` in each item.
- Use `Zod` or TypeScript interfaces to validate API inputs and schema integrity.

```ts
// Example: Item type
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  location: 'pantry' | 'fridge' | 'freezer';
  expirationDate: string;
  updatedAt: string;
}
```

## 🧩 Application Features Structure

- Separate logic into core modules:
  - `/components/inventory` for inventory cards and item modals
  - `/components/recipes` for recipe lists and ingredient matchers
  - `/lib/db.ts` for PostgreSQL access
  - `/pages/api/` for SSR routes to manage CRUD operations
- Use shared components like `InputField`, `Modal`, and `DatePicker`.

## 🧾 Form Handling & Input

- Use form libraries like `astro-forms`, `unocss`, or native HTML forms with client:load hydration for interactivity.
- Validate expiration dates and quantity formats before submission.
- Add client-side form feedback (success or error messages).

## 🛍️ Recipe & Shopping Logic

- Build a utility to match recipes with current inventory.
- Generate a dynamic shopping list for missing ingredients.
- Consider fuzzy matching for item names (e.g., "tomato" vs "cherry tomatoes").

```ts
// Match ingredients
function findMissingIngredients(recipeIngredients, inventoryItems) {
  return recipeIngredients.filter(
    (ingredient) => !inventoryItems.some((item) => item.name.includes(ingredient.name))
  );
}
```
