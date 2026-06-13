import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

// Lazy initialize client to prevent startup crash if GEMINI_API_KEY is not defined.
let aiClient: GoogleGenAI | null = null;
function getGenAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please add it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Log requests
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // API Endpoint to generate meal plan and groceries
  app.post("/api/plan-meals", async (req, res) => {
    try {
      const { availableGroceries, cuisinePreference, dailyBudget } = req.body;

      if (!Array.isArray(availableGroceries)) {
        return res.status(400).json({ error: "availableGroceries must be an array of strings." });
      }

      const cuisine = cuisinePreference || "any";
      const budget = Number(dailyBudget) || 30;

      const ai = getGenAI();

      const prompt = `You are an expert chef, nutritionist, and clever budget planner. 
Based on the user's available groceries, cuisine preference, and daily budget, generate:
1. A structured meal selection for Breakfast, Lunch, and Dinner.
2. A list of extra items that need to be bought (groceryList) with estimated cost, category, and quantity.
3. Creative alternate/substitute meals that can be made using ONLY the user's available groceries (or subtle common pantry staples).

User Details:
- Available Groceries in Hand: ${availableGroceries.length > 0 ? availableGroceries.join(", ") : "None / Empty (build meals mostly using the specified budget to buy fresh items)"}
- Cuisine Preference: ${cuisine}
- Daily Budget for missing items: $${budget}

Rules:
- Keep the meal recipes and instructions realistic, tasty, and well-aligned with the "${cuisine}" theme.
- Calculate the cost of additional required ingredients accurately and make sure the total extra purchase costs stay reasonably close or below the daily budget of $${budget} whenever possible.
- Offer constructive feedback if the budget is very tight or suggest premium/high-quality items if there is plenty of budget remaining.
- Suggested "alternateMeals" should be meal options that could be made with the available groceries list already supplied, showing how they can reuse their inventory. Provide 2 to 3 alternate meal options.
- Maintain high-quality step-by-step instructions for all three primary meals and the alternative suggestions.`;

      console.log("Generating content using gemini-3.5-flash...");
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.7,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              meals: {
                type: Type.OBJECT,
                properties: {
                  breakfast: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      preparationTime: { type: Type.STRING, description: "e.g., '15 mins', '10 mins'" },
                      keyIngredientsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
                      additionalIngredientsNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
                      estimatedCost: { type: Type.NUMBER, description: "Estimated cost in USD of missing ingredients needed for this meal" },
                      instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["name", "description", "preparationTime", "keyIngredientsUsed", "additionalIngredientsNeeded", "estimatedCost", "instructions"],
                  },
                  lunch: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      preparationTime: { type: Type.STRING },
                      keyIngredientsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
                      additionalIngredientsNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
                      estimatedCost: { type: Type.NUMBER },
                      instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["name", "description", "preparationTime", "keyIngredientsUsed", "additionalIngredientsNeeded", "estimatedCost", "instructions"],
                  },
                  dinner: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      preparationTime: { type: Type.STRING },
                      keyIngredientsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
                      additionalIngredientsNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
                      estimatedCost: { type: Type.NUMBER },
                      instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["name", "description", "preparationTime", "keyIngredientsUsed", "additionalIngredientsNeeded", "estimatedCost", "instructions"],
                  },
                },
                required: ["breakfast", "lunch", "dinner"],
              },
              groceryList: {
                type: Type.ARRAY,
                description: "List of ingredients NOT currently available in hand that must be purchased to complete the daily menu",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    estimatedCost: { type: Type.NUMBER, description: "Estimated consumer cost in USD" },
                    quantity: { type: Type.STRING, description: "e.g., '1 carton', '500g', '2 packs'" },
                    category: { type: Type.STRING, description: "e.g., 'Dairy', 'Produce', 'Pantry', 'Butcher'" },
                    usedInMeal: { type: Type.STRING, description: "Which of breakfast/lunch/dinner will use this ingredient" },
                  },
                  required: ["name", "estimatedCost", "quantity", "category", "usedInMeal"],
                },
              },
              alternateMeals: {
                type: Type.ARRAY,
                description: "Meal options constructed almost entirely from available groceries list, suggesting alternates or substitute meals.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    mealCategory: { type: Type.STRING, description: "Must be 'Breakfast', 'Lunch', or 'Dinner'" },
                    description: { type: Type.STRING },
                    whyItIsAGoodAlternative: { type: Type.STRING, description: "Why this alternative meal is a fantastic match for your current kitchen items" },
                    instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ["name", "mealCategory", "description", "whyItIsAGoodAlternative", "instructions"],
                },
              },
              totalEstimatedExtraSpend: { type: Type.NUMBER, description: "Total estimated extra cost to purchase items on groceryList, in USD" },
              budgetAnalysis: {
                type: Type.OBJECT,
                properties: {
                  totalSpend: { type: Type.NUMBER },
                  status: { type: Type.STRING, description: "Should be 'Within Budget', 'Slightly Over Budget', or 'Requires Budget Adjustment'" },
                  savingsOrOverrun: { type: Type.NUMBER, description: "Difference between budget and spend (positive for savings, negative for overrun) in USD" },
                  tipsToStayOnBudget: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Clever hacks or smart budget recommendations" },
                },
                required: ["totalSpend", "status", "savingsOrOverrun", "tipsToStayOnBudget"],
              },
            },
            required: ["meals", "groceryList", "alternateMeals", "totalEstimatedExtraSpend", "budgetAnalysis"],
          },
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("No response text received from Gemini API");
      }

      const planData = JSON.parse(text.trim());
      res.json(planData);
    } catch (error: any) {
      console.error("Meal planning error:", error);
      res.status(500).json({
        error: error.message || "An unexpected error occurred while planning your meals.",
      });
    }
  });

  // Serve static UI assets and handle dev server
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
