export interface Meal {
  name: string;
  description: string;
  preparationTime: string;
  keyIngredientsUsed: string[];
  additionalIngredientsNeeded: string[];
  estimatedCost: number;
  instructions: string[];
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity?: string;
  category?: string;
  estimatedCost?: number;
  usedInMeal?: string;
}

export interface AlternateMeal {
  name: string;
  mealCategory: 'Breakfast' | 'Lunch' | 'Dinner';
  description: string;
  whyItIsAGoodAlternative: string;
  instructions: string[];
}

export interface BudgetAnalysis {
  totalSpend: number;
  status: 'Within Budget' | 'Slightly Over Budget' | 'Requires Budget Adjustment';
  savingsOrOverrun: number;
  tipsToStayOnBudget: string[];
}

export interface MealPlanResponse {
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
  };
  groceryList: Array<{
    name: string;
    estimatedCost: number;
    quantity: string;
    category: string;
    usedInMeal: string;
  }>;
  alternateMeals: AlternateMeal[];
  totalEstimatedExtraSpend: number;
  budgetAnalysis: BudgetAnalysis;
}

export interface PlannerInput {
  availableGroceries: string[];
  cuisinePreference: string;
  dailyBudget: number;
}
