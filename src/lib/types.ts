export interface FoodItem {
  item_id: number;
  user_id: number;
  name: string;
  quantity: string;
  location: 'Pantry' | 'Refrigerator' | 'Freezer';
  expiration_date: string;
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  recipe_id: number;
  user_id: number;
  name: string;
  instructions: string;
  image_url?: string;
  created_at: string;
}

export interface RecipeIngredient {
  recipe_ingredient_id: number;
  recipe_id: number;
  ingredient_name: string;
  required_quantity: string;
}

export interface ShoppingListItem {
  shopping_item_id: number;
  user_id: number;
  recipe_id?: number;
  item_name: string;
  quantity_needed: string;
  is_checked: boolean;
  added_at: string;
}

export interface Notification {
  notification_id: number;
  user_id: number;
  item_id?: number;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface User {
  user_id: number;
  email: string;
  password_hash: string;
  created_at: string;
}
