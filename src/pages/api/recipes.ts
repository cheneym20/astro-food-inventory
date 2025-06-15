import type { APIRoute } from 'astro';
import { query } from '../../lib/db';

export const GET: APIRoute = async () => {
  // Fetch recipes and their ingredients
  const { rows: recipes } = await query('SELECT * FROM recipes ORDER BY created_at DESC');
  const { rows: ingredients } = await query('SELECT * FROM recipe_ingredients');

  // Attach ingredients to each recipe
  const recipesWithIngredients = recipes.map(recipe => ({
    ...recipe,
    ingredients: ingredients.filter(ing => ing.recipe_id === recipe.recipe_id),
  }));

  return new Response(JSON.stringify(recipesWithIngredients), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
