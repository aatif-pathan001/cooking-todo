import React, { useState, useEffect } from 'react';
import { 
  Coffee, Sun, Moon, ShoppingCart, AlertCircle, 
  ChevronDown, ChevronUp, DollarSign, PiggyBank, Sparkles, 
  ChefHat, ArrowRight, Lightbulb, Clock, CheckSquare, Square,
  Plus, X, Search, Carrot, Flame, Cookie, Egg, ListPlus,
  Activity, RotateCcw, ShieldCheck, HelpCircle, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MealPlanResponse, Meal, AlternateMeal } from './types';

// Default initial state matching the high-fidelity Mediterranean preset for initial preview
const INITIAL_MEAL_PLAN: MealPlanResponse = {
  meals: {
    breakfast: {
      name: "Sautéed Spinach & Garlic Protein Omelette",
      description: "A fluffy double-egg omelette made with fresh spinach leaves and golden roasted garlic sautéed in extra virgin olive oil. A balanced, low-carb high protein start.",
      preparationTime: "10 mins",
      keyIngredientsUsed: ["Eggs", "Spinach", "Garlic", "Olive Oil"],
      additionalIngredientsNeeded: ["Feta Cheese", "Cherry Tomatoes"],
      estimatedCost: 3.50,
      instructions: [
        "Crack 2 fresh eggs into a bowl and whisk lightly with a pinch of sea salt.",
        "Thinly slice the garlic cloves and clean the baby spinach leaves.",
        "Heat olive oil in a skillet, add garlic and sauté for 1 minute until fragrant.",
        "Toss in spinach leaves until just wilted. Pour the whisked eggs evenly over.",
        "As edges set, lift with a spatula to let raw egg flow underneath. Sprinkle crumbled feta and fold.",
        "Serve hot alongside sliced cherry tomatoes."
      ]
    },
    lunch: {
      name: "Lemon-Garlic Pan Chicken Pasta",
      description: "Pan-seared tender chicken strips cooked in an aromatic sauce of garlic, olive oil, and fresh lemon juice, tossed with pasta and young spinach leaves.",
      preparationTime: "20 mins",
      keyIngredientsUsed: ["Chicken Breast", "Pasta", "Garlic", "Olive Oil", "Lemon"],
      additionalIngredientsNeeded: ["Parmesan Cheese", "Fresh Basil"],
      estimatedCost: 6.20,
      instructions: [
        "Boil the dry pasta in salted water according to package instructions (approx. 9 mins). Reserve 1/4 cup pasta water.",
        "Slice chicken breast into bite-sized thin strips. Season lightly with salt.",
        "Heat olive oil in a non-stick pan. Sear chicken for 5-6 minutes until beautifully golden.",
        "Reduce heat, toss in minced garlic for 30 seconds, then squeeze fresh lemon juice directly into the pan.",
        "Add cooked pasta, wilted spinach leaves, and the reserved pasta water. Toss vigorously.",
        "Garnish with grated Parmesan cheese and serve warm."
      ]
    },
    dinner: {
      name: "Crisp Roasted Chicken & Greek Yogurt Purée",
      description: "Herb-seared chicken breast roasted with onions, served on a bed of cool, zesty garlic-lemon Greek yogurt dressing.",
      preparationTime: "25 mins",
      keyIngredientsUsed: ["Chicken Breast", "Onions", "Greek Yogurt", "Lemon", "Garlic", "Olive Oil"],
      additionalIngredientsNeeded: ["Cucumber", "Dill"],
      estimatedCost: 4.80,
      instructions: [
        "Preheat your oven or toaster oven to 375°F (190°C).",
        "Toss sliced onion rings and halved chicken breast in olive oil, sea salt, and a dash of pepper.",
        "Roast in oven for 15-18 minutes until chicken is perfectly cooked through (internal temp 165°F).",
        "In a small serving bowl, mix Greek yogurt with grated garlic, a squeeze of lemon juice, and chopped dill.",
        "Spread the seasoned lemon yogurt purée onto the plate layer.",
        "Slice hot roasted chicken breast, arrange on top with roasted onions, and drizzle with remaining pan juices."
      ]
    }
  },
  groceryList: [
    { name: "Fresh Eggs (6-pack)", estimatedCost: 3.50, quantity: "1 carton", category: "Dairy & Protein", usedInMeal: "Breakfast" },
    { name: "Greek Feta Cheese", estimatedCost: 4.00, quantity: "150g", category: "Dairy & Protein", usedInMeal: "Breakfast" },
    { name: "Cherry Tomatoes", estimatedCost: 3.20, quantity: "200g", category: "Produce", usedInMeal: "Breakfast / Salad" },
    { name: "Aged Parmesan Cheese", estimatedCost: 3.80, quantity: "100g", category: "Dairy & Protein", usedInMeal: "Lunch" },
  ],
  alternateMeals: [
    {
      name: "Creamy Lemon Yogurt Pasta",
      mealCategory: "Lunch",
      description: "Combine boiled pasta, lemon zest, quick roasted garlic paste, and Greek yogurt for an instant velvety, protein-packed vegetarian sauce.",
      whyItIsAGoodAlternative: "Perfect backup option if you run out of chicken breasts but want to maintain high protein levels using dairy items already in stock.",
      instructions: [
        "Boil pasta until al dente.",
        "Mix 3 spoonfuls of Greek yogurt with minced fresh garlic, black pepper, and lemon juice until smooth.",
        "Stir yogurt sauce directly into warm pasta relative to remaining stove heat (do not boil to avoid curdling)."
      ]
    },
    {
      name: "Sautéed Lemon Garlic Spinach Bowl",
      mealCategory: "Dinner",
      description: "A fast vegan stir-fry composed of garlic slices, yellow onions, and spinach wilted in quality olive oil, finished with lemon juice.",
      whyItIsAGoodAlternative: "Excellent calorie-miser light dinner choice that minimizes cooking times to 5 minutes.",
      instructions: [
        "Sauté sliced onions and garlic chunks in oil.",
        "Toss dry spinach in the hot pan for exactly 45 seconds until bright green.",
        "Tarnish with coarse salt and fresh lemon wedges."
      ]
    }
  ],
  totalEstimatedExtraSpend: 14.50,
  budgetAnalysis: {
    totalSpend: 14.50,
    status: "Within Budget",
    savingsOrOverrun: 10.50,
    tipsToStayOnBudget: [
      "Buy store-brand block Feta instead of pre-crumbled varieties to save up to 35%.",
      "Reuse lemon rinds to infuse drinking water or finish other basic dishes.",
      "Substitute normal cherry tomatoes with plum tomatoes which are often cheaper per ounce."
    ]
  }
};

const POPULAR_INGREDIENTS = [
  { name: 'Eggs', category: 'Dairy & Protein', icon: Egg },
  { name: 'Milk', category: 'Dairy & Protein', icon: Egg },
  { name: 'Greek Yogurt', category: 'Dairy & Protein', icon: Egg },
  { name: 'Chicken Breast', category: 'Meat & Fish', icon: Flame },
  { name: 'Garlic', category: 'Vegetables', icon: Carrot },
  { name: 'Spinach', category: 'Vegetables', icon: Carrot },
  { name: 'Onions', category: 'Vegetables', icon: Carrot },
  { name: 'Olive Oil', category: 'Grains & Pantry', icon: Cookie },
  { name: 'Pasta', category: 'Grains & Pantry', icon: Cookie },
  { name: 'Lemon', category: 'Produce', icon: Carrot },
  { name: 'Butter', category: 'Dairy & Protein', icon: Egg },
  { name: 'Potatoes', category: 'Vegetables', icon: Carrot },
  { name: 'Tomatoes', category: 'Vegetables', icon: Carrot },
  { name: 'Cheese', category: 'Dairy & Protein', icon: Egg },
  { name: 'Bell Peppers', category: 'Vegetables', icon: Carrot },
  { name: 'White Rice', category: 'Grains & Pantry', icon: Cookie },
  { name: 'Bread', category: 'Grains & Pantry', icon: Cookie },
];

export default function App() {
  // Config state
  const [availableGroceries, setAvailableGroceries] = useState<string[]>([
    'Chicken Breast', 'Spinach', 'Garlic', 'Onions', 'Olive Oil', 'Pasta', 'Greek Yogurt', 'Lemon'
  ]);
  const [cuisinePreference, setCuisinePreference] = useState<string>('Mediterranean Modern');
  const [dailyBudget, setDailyBudget] = useState<number>(25);
  
  // Custom states for inputs
  const [customItem, setCustomItem] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // UI active flags
  const [minimizeWaste, setMinimizeWaste] = useState<boolean>(true);
  const [speedToCook, setSpeedToCook] = useState<boolean>(false);
  const [proteinFocused, setProteinFocused] = useState<boolean>(true);

  // Result state
  const [mealPlan, setMealPlan] = useState<MealPlanResponse | null>(INITIAL_MEAL_PLAN);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Logging flow for high-density tech aesthetic
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [activeExpandedMeal, setActiveExpandedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | null>('breakfast');
  const [activeExpandedAlt, setActiveExpandedAlt] = useState<number | null>(null);
  const [checkedGroceries, setCheckedGroceries] = useState<Record<string, boolean>>({});

  const writeLog = (msg: string) => {
    setLogMessages(prev => [...prev.slice(-3), msg]);
  };

  // Run initial logger effect for aesthetic
  useEffect(() => {
    writeLog("SYSTEM INITIALIZED // WAITING FOR PROTOCOL INPUT");
  }, []);

  const handleTogglePopular = (name: string) => {
    const lower = name.toLowerCase().trim();
    const exists = availableGroceries.some(g => g.toLowerCase() === lower);
    if (exists) {
      setAvailableGroceries(prev => prev.filter(g => g.toLowerCase() !== lower));
      writeLog(`REMOVED ${name.toUpperCase()} FROM CABINET`);
    } else {
      const formattedName = name.trim().replace(/^\w/, (c) => c.toUpperCase());
      setAvailableGroceries(prev => [...prev, formattedName]);
      writeLog(`ADDED ${name.toUpperCase()} TO CABINET`);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItem.trim()) return;
    const lower = customItem.toLowerCase().trim();
    const exists = availableGroceries.some(g => g.toLowerCase() === lower);
    if (!exists) {
      const formatted = customItem.trim().replace(/^\w/, (c) => c.toUpperCase());
      setAvailableGroceries(prev => [...prev, formatted]);
      writeLog(`ADDED CUSTOM ${formatted.toUpperCase()} TO MANUAL STACK`);
    }
    setCustomItem('');
  };

  const handleRemoveCabinetItem = (index: number) => {
    const discarded = availableGroceries[index];
    setAvailableGroceries(prev => prev.filter((_, i) => i !== index));
    writeLog(`REMOVED ${discarded?.toUpperCase() || "ITEM"}`);
  };

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setLogMessages([]);
    
    writeLog("ESTABLISHING AGENT NETWORK ORCHESTRATION...");
    setTimeout(() => writeLog("SEARCHING PANTRY SUBSTITUTES..."), 600);
    setTimeout(() => writeLog(`EVALUATING ${cuisinePreference.toUpperCase()} STYLE PROTOCOL...`), 1200);
    setTimeout(() => writeLog(`ENFORCING FINANCIAL LIMIT OF $${dailyBudget}...`), 1850);

    try {
      const res = await fetch("/api/plan-meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          availableGroceries,
          cuisinePreference: `${cuisinePreference}${minimizeWaste ? " (Minimize Waste focused)" : ""}${speedToCook ? " (Easy/Quick cooking)" : ""}${proteinFocused ? " (High protein balance)" : ""}`,
          dailyBudget
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Backend model calculation failed.");
      }

      const data: MealPlanResponse = await res.json();
      setMealPlan(data);
      setCheckedGroceries({});
      writeLog("OPTIMIZATION COMPLETED! SCHEMA RENDERED VIA COGNITIVE LAYER");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Unable to parse request. Is your API Key set or server running?");
      writeLog("ERROR // SYSTEM PIPELINE CRASHED");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPopular = POPULAR_INGREDIENTS.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats calculation
  const totalPurchaseCost = mealPlan ? mealPlan.groceryList.reduce((sum, item) => sum + (item.estimatedCost || 0), 0) : 0;
  const isOverBudget = totalPurchaseCost > dailyBudget;
  const overrunOrSaving = Math.abs(dailyBudget - totalPurchaseCost);

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] p-4 font-sans md:p-6" id="app-root">
      
      {/* Outer black cardboard frame */}
      <div className="max-w-7xl mx-auto border-4 border-[#141414] bg-white shadow-[8px_8px_0px_0px_#141414] rounded-sm overflow-hidden flex flex-col min-h-[90vh]">
        
        {/* Dynamic Editorial Header */}
        <header className="border-b-4 border-[#141414] bg-white px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif italic text-3xl font-black tracking-tight" id="brand-logo">
              CulinaPlan AI.
            </h1>
            <p className="text-xs font-mono uppercase tracking-wider text-neutral-600 mt-1">
              High-Density Daily Menu Planner & Smart Procurement Matrix
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-neutral-800 border-t md:border-t-0 pt-2 md:pt-0 border-neutral-200">
            <div>
              <span className="text-neutral-400">ENGINE STATUS:</span>{" "}
              <span className="font-bold text-emerald-700">● LIVE</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-neutral-400">VERSION:</span>{" "}
              <span className="font-bold">v3.5.1-Flash</span>
            </div>
            <div>
              <span className="text-neutral-400 font-mono">TIME (UTC):</span>{" "}
              <span className="font-bold underline">12-Jun-2026</span>
            </div>
          </div>
        </header>

        {/* Real-time system operations ticker log */}
        <div className="bg-[#141414] text-[#E4E3E0] px-6 py-2.5 font-mono text-[10px] flex items-center justify-between gap-4 overflow-hidden" id="status-telemetry-strip">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-block w-2 h-2 bg-amber-400 rounded-full animate-ping flex-shrink-0"></span>
            <span className="text-neutral-400">CONSOLE OUT:</span>
            <span className="text-amber-300 truncate">
              {logMessages.length > 0 ? logMessages[logMessages.length - 1] : "AWAITING USER CORE CONFIGURATION"}
            </span>
          </div>
          <div className="hidden md:flex gap-4 text-[9px] text-neutral-400">
            <span>WASTE METER: {minimizeWaste ? "[ACTIVE]" : "[MINIMAL]"}</span>
            <span>BUDGET: ${dailyBudget}.00 USD</span>
          </div>
        </div>

        {/* Triple Column High-Density Editorial Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 bg-[#E4E3E0]">
          
          {/* COLUMN 1: CONFIGURATION BAR (lg:col-span-3) */}
          <section className="lg:col-span-3 bg-white border-b-2 lg:border-b-0 lg:border-r-2 border-[#141414] p-5 flex flex-col justify-between" id="user-pantry-column">
            <div>
              <div className="border-b border-dashed border-[#141414] pb-2 mb-4 flex items-center justify-between">
                <span className="font-serif italic font-bold text-sm text-[#141414] uppercase tracking-wide">
                  I. Input Matrix
                </span>
                <span className="font-mono text-[10px] bg-[#141414] text-white px-2 py-0.5 rounded-sm">
                  CTRL-A
                </span>
              </div>

              {/* Cuisine Selection */}
              <div className="mb-5">
                <label className="block font-mono text-[10px] font-bold uppercase text-neutral-600 mb-1.5" htmlFor="cuisine-input">
                  Cuisine Protocol
                </label>
                <div className="relative">
                  <select
                    id="cuisine-input"
                    value={cuisinePreference}
                    onChange={(e) => setCuisinePreference(e.target.value)}
                    className="w-full font-serif italic text-base font-bold bg-[#E4E3E0]/30 border-2 border-[#141414] px-3 py-2 rounded-none focus:outline-none focus:bg-[#E4E3E0]/70 cursor-pointer"
                  >
                    <option value="Mediterranean Modern">Mediterranean Modern</option>
                    <option value="Classic Italian Bistro">Classic Italian Bistro</option>
                    <option value="Japanese Zen Nutrition">Japanese Minimalist</option>
                    <option value="Mexican Rustic street food">Mexican Fresh Fiesta</option>
                    <option value="Indian Fragrant Masala">Indian Fragrant Spices</option>
                    <option value="American High-Protein Sports">Muscle Builder Grill</option>
                    <option value="Any Chef's Choice">Chef's Gourmet Choice</option>
                  </select>
                </div>
              </div>

              {/* Budget Limit Selection */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-mono text-[10px] font-bold uppercase text-neutral-600" htmlFor="budget-slider">
                    Procurement Budget
                  </label>
                  <span className="font-mono text-xs font-bold bg-[#141414] text-white px-1.5 py-0.2">
                    ${dailyBudget}.00
                  </span>
                </div>
                
                <input
                  type="range"
                  id="budget-slider"
                  min="5"
                  max="100"
                  step="5"
                  value={dailyBudget}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setDailyBudget(val);
                    writeLog(`ADJUSTED HOURLY EXPENDITURE MAXIMUM TO $${val}`);
                  }}
                  className="w-full accent-[#141414] bg-neutral-200 h-1.5 rounded-none cursor-pointer"
                />
                
                <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500 mt-1">
                  <span>Min: $5</span>
                  <span>Max: $100</span>
                </div>
              </div>

              {/* Optimization Parameters */}
              <div className="mb-5 border-t border-dashed border-[#141414]/20 pt-4">
                <span className="block font-mono text-[10px] font-bold uppercase text-neutral-600 mb-2">
                  Heuristic Tuning
                </span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-neutral-50 p-1">
                    <input
                      type="checkbox"
                      checked={minimizeWaste}
                      onChange={(e) => {
                        setMinimizeWaste(e.target.checked);
                        writeLog(`${e.target.checked ? "ENABLED" : "DISABLED"} MINIMIZE INVENTORY WASTE PROTOCOL`);
                      }}
                      className="accent-[#141414]"
                    />
                    <span>Minimize Cargo Waste [X]</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer hover:bg-neutral-50 p-1">
                    <input
                      type="checkbox"
                      checked={speedToCook}
                      onChange={(e) => {
                        setSpeedToCook(e.target.checked);
                        writeLog(`${e.target.checked ? "ENABLED" : "DISABLED"} EXPRESS COOKING (SPEED) FILTER`);
                      }}
                      className="accent-[#141414]"
                    />
                    <span>Rapid Preparation (&lt;20m) [ ]</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer hover:bg-neutral-50 p-1">
                    <input
                      type="checkbox"
                      checked={proteinFocused}
                      onChange={(e) => {
                        setProteinFocused(e.target.checked);
                        writeLog(`${e.target.checked ? "ENABLED" : "DISABLED"} STRENGTH/PROTEIN NUTRIENT RATIOS`);
                      }}
                      className="accent-[#141414]"
                    />
                    <span>Protein Prioritization 🏋️</span>
                  </label>
                </div>
              </div>

              {/* Cabinet List Title & Input */}
              <div className="border-t border-[#141414] pt-4 mt-2">
                <span className="block font-mono text-[10px] font-bold uppercase text-neutral-600 mb-1.5">
                  Dry Stock Cabinets
                </span>

                <div className="flex flex-wrap gap-1 mb-4 overflow-y-auto max-h-[140px] pr-1 border border-dashed border-[#141414]/30 p-2 bg-[#E4E3E0]/20">
                  {availableGroceries.length === 0 ? (
                    <span className="text-[10px] font-mono italic text-neutral-400 select-none">
                      Cabinet Empty. Use toggles/add below.
                    </span>
                  ) : (
                    availableGroceries.map((item, idx) => (
                      <span
                        key={`${item}-${idx}`}
                        className="inline-flex items-center gap-1 font-mono text-[11px] border border-[#141414] px-1.5 py-0.5 bg-white shadow-[1px_1px_0px_#141414]"
                      >
                        <span className="truncate max-w-[80px]">{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCabinetItem(idx)}
                          className="hover:bg-red-50 text-red-700 px-0.5 font-bold"
                          title={`Eject ${item}`}
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Form to enter custom ingredient */}
                <form onSubmit={handleAddCustom} className="flex gap-1" id="fast-custom-form">
                  <input
                    type="text"
                    value={customItem}
                    onChange={(e) => setCustomItem(e.target.value)}
                    placeholder="Dry stock item..."
                    className="flex-1 font-mono text-xs border border-[#141414] px-2 py-1 focus:outline-none focus:bg-amber-50"
                  />
                  <button
                    type="submit"
                    className="border border-[#141414] font-mono text-xs px-2 py-1 bg-[#141414] text-white active:bg-neutral-800"
                  >
                    +
                  </button>
                </form>
              </div>

            </div>

            {/* Bottom Generation Trigger */}
            <div className="pt-4 mt-6 border-t-2 border-[#141414] border-dashed">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleGeneratePlan}
                className="w-full border-2 border-[#141414] bg-[#141414] text-white hover:bg-white hover:text-[#141414] active:bg-[#E4E3E0] font-serif italic font-extrabold text-lg py-3 px-4 shadow-[4px_4px_0px_0px_#000]/10 hover:shadow-none transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                id="generate-plan-trigger"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Calculating Protocol...
                  </>
                ) : (
                  <>
                    Run Optimized Planner →
                  </>
                )}
              </button>
              <div className="text-[9px] font-mono text-neutral-400 mt-1 text-center">
                Gemini Multi-Agent optimization based on dynamic fridge logs.
              </div>
            </div>

          </section>

          {/* COLUMN 2: GENERATED MEAL PROTOCOL (lg:col-span-6) */}
          <section className="lg:col-span-6 border-b-2 lg:border-b-0 lg:border-r-2 border-[#141414] flex flex-col bg-white" id="meal-recipe-column">
            <div className="bg-[#141414]/5 px-5 py-3 border-b-2 border-[#141414] flex items-center justify-between">
              <span className="font-serif italic font-bold text-sm uppercase tracking-wide">
                II. Daily Meal Protocol Selections
              </span>
              <span className="font-mono text-[10px] text-neutral-500 uppercase">
                Interactive Recipe Sheets
              </span>
            </div>

            {errorMessage ? (
              <div className="p-8 text-center bg-red-50 text-red-950 flex-1 flex flex-col items-center justify-center gap-4">
                <AlertCircle className="w-12 h-12 text-red-600" />
                <div>
                  <h3 className="font-mono font-bold uppercase text-sm">Orchestration Disrupted</h3>
                  <p className="text-xs mt-2 max-w-md">{errorMessage}</p>
                </div>
                <button
                  type="button"
                  onClick={handleGeneratePlan}
                  className="px-4 py-1.5 border border-[#141414] font-mono text-xs bg-white text-dark shadow-[2px_2px_0px_#141414]"
                >
                  Force Pipeline Restart
                </button>
              </div>
            ) : mealPlan ? (
              <div className="flex-1 divide-y-2 divide-[#141414] overflow-y-auto">
                
                {/* Visual Dashboard Highlights */}
                <div className="p-4 bg-[#E4E3E0]/30 grid grid-cols-3 gap-2.5 text-center border-b border-[#141414]">
                  <div>
                    <span className="block text-[9px] font-mono uppercase text-neutral-500">Dietary Style</span>
                    <span className="text-xs font-serif italic font-extrabold text-[#141414] truncate block">
                      {cuisinePreference}
                    </span>
                  </div>
                  <div className="border-x border-neutral-300">
                    <span className="block text-[9px] font-mono uppercase text-neutral-500">Procured Sparing</span>
                    <span className={`text-xs font-mono font-bold ${isOverBudget ? "text-red-700" : "text-emerald-700"}`}>
                      ${totalPurchaseCost.toFixed(2)} / ${dailyBudget}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono uppercase text-neutral-500">Fresh Groceries Needed</span>
                    <span className="text-xs font-mono font-bold text-neutral-900 block">
                      {mealPlan.groceryList.length} Items ({mealPlan.meals.breakfast.additionalIngredientsNeeded.length + mealPlan.meals.lunch.additionalIngredientsNeeded.length + mealPlan.meals.dinner.additionalIngredientsNeeded.length} total units)
                    </span>
                  </div>
                </div>

                {/* THREE MEALS ACCORDION */}
                {(['breakfast', 'lunch', 'dinner'] as const).map((mealKey, index) => {
                  const meal: Meal = mealPlan.meals[mealKey];
                  const isExpanded = activeExpandedMeal === mealKey;
                  const romanNumerals = ["I", "II", "III"];
                  const icons = [Coffee, Sun, Moon];
                  const SpecIcon = icons[index];

                  return (
                    <article key={mealKey} className="bg-white" id={`meal-section-${mealKey}`}>
                      
                      {/* Accordion Tab Header */}
                      <button
                        type="button"
                        onClick={() => setActiveExpandedMeal(isExpanded ? null : mealKey)}
                        className="w-full text-left p-5 hover:bg-[#E4E3E0]/20 focus:outline-none transition-colors border-l-4 border-l-[#141414] flex items-center justify-between gap-4 cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-neutral-400">
                              PROTOCOL 0{index + 1} // {romanNumerals[index]}
                            </span>
                            <span className="font-mono text-[9px] bg-neutral-100 text-neutral-600 px-1.5 py-0.2 border border-neutral-200">
                              ⏱️ {meal.preparationTime}
                            </span>
                          </div>
                          <h3 className="font-serif italic text-xl font-black text-[#141414] mt-1 flex items-center gap-2">
                            <SpecIcon className="w-4 h-4 inline-block text-neutral-700" />
                            {meal.name}
                          </h3>
                        </div>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-neutral-900" /> : <ChevronDown className="w-5 h-5 text-[#141414]" />}
                      </button>

                      {/* Accordion Content */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                          >
                            <div className="px-5 pb-6 pt-1 border-t border-dashed border-[#141414]/15 bg-stone-50/50 space-y-4">
                              <p className="text-xs text-neutral-700 leading-relaxed max-w-2xl italic font-serif">
                                "{meal.description}"
                              </p>

                              {/* Ingredient Split layout */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                                <div className="bg-[#E4E3E0]/20 border border-[#141414]/20 p-3">
                                  <span className="font-mono text-[9px] font-bold uppercase text-neutral-500 block mb-2 tracking-wide">
                                    [✓] In Hand (Zero Cost)
                                  </span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {meal.keyIngredientsUsed.map((ing, i) => (
                                      <span key={i} className="font-mono text-[10px] bg-white border border-[#141414]/10 px-1.5 py-0.5 shadow-[1px_1px_0px_#141414]/5 text-neutral-800">
                                        {ing}
                                      </span>
                                    ))}
                                    {meal.keyIngredientsUsed.length === 0 && (
                                      <span className="text-[10px] font-mono italic text-neutral-400">No stock ingredients mapped here.</span>
                                    )}
                                  </div>
                                </div>

                                <div className="bg-amber-50/30 border border-amber-900/15 p-3">
                                  <span className="font-mono text-[9px] font-bold uppercase text-amber-800 block mb-2 tracking-wide">
                                    [!] Procurement Required (Estimated Spend: ${meal.estimatedCost.toFixed(2)})
                                  </span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {meal.additionalIngredientsNeeded.map((ing, i) => (
                                      <span key={i} className="font-mono text-[10px] bg-white border border-amber-900/20 px-1.5 py-0.5 text-neutral-800">
                                        {ing}
                                      </span>
                                    ))}
                                    {meal.additionalIngredientsNeeded.length === 0 && (
                                      <span className="text-[11px] font-medium text-emerald-800">Fully Stocked! 🎉</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Complete instructions step protocol */}
                              <div className="border border-[#141414] bg-white p-4">
                                <span className="font-mono text-[9px] font-bold uppercase text-neutral-500 block mb-3">
                                  Execution Instruction Guidelines
                                </span>
                                <ol className="divide-y divide-[#141414]/10 font-mono text-xs">
                                  {meal.instructions.map((step, sIdx) => (
                                    <li key={sIdx} className="py-2.5 first:pt-0 last:pb-0 flex gap-3 align-top leading-relaxed text-neutral-900">
                                      <span className="font-bold text-neutral-400 flex-shrink-0">
                                        {(sIdx + 1).toString().padStart(2, "0")}.
                                      </span>
                                      <span>{step}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </article>
                  );
                })}

              </div>
            ) : (
              <div className="p-12 text-center flex-1 flex flex-col items-center justify-center gap-4 bg-stone-50">
                <ChefHat className="w-16 h-16 text-neutral-400 stroke-[1.2]" />
                <div>
                  <h3 className="font-serif italic font-extrabold text-lg">No Active Blueprint Plan</h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm">
                    Toggle ingredients on the left panel or press the "Run Optimized Planner" button to trigger the model!
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* COLUMN 3: PROCUREMENT LIST & SUBSTITUTE ANALYSIS (lg:col-span-3) */}
          <section className="lg:col-span-3 flex flex-col bg-[#E4E3E0]/40" id="logistics-procurement-column">
            
            {/* PROCUREMENT SEC */}
            <div className="flex-1 flex flex-col min-h-[300px]">
              <div className="bg-[#141414]/5 px-5 py-3 border-b-2 border-[#141414] flex items-center justify-between">
                <span className="font-serif italic font-bold text-sm uppercase tracking-wide">
                  III. Procurement List
                </span>
                <span className="font-mono text-[10px] text-neutral-500">
                  {mealPlan ? mealPlan.groceryList.length : 0} Items
                </span>
              </div>

              <div className="p-4 flex-1 overflow-y-auto max-h-[380px]">
                {mealPlan && mealPlan.groceryList.length > 0 ? (
                  <div className="space-y-1.5">
                    {mealPlan.groceryList.map((item, idx) => {
                      const isChecked = !!checkedGroceries[item.name];
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setCheckedGroceries(prev => ({ ...prev, [item.name]: !isChecked }));
                            writeLog(`${isChecked ? "UNCHECKED" : "CHECKED"} ${item.name.toUpperCase()} FROM PROCURABLE LIST`);
                          }}
                          className={`flex items-center justify-between p-2.5 border border-[#141414] bg-white transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-none select-none ${
                            isChecked ? "opacity-50 line-through bg-neutral-100" : ""
                          }`}
                          id={`procurement-item-${idx}`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-neutral-700 flex-shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                            )}
                            <div className="min-w-0 leading-tight">
                              <span className="font-mono text-xs font-bold text-[#141414] block truncate">
                                {item.name}
                              </span>
                              <span className="text-[10px] font-mono text-neutral-500">
                                {item.quantity} // {item.category}
                              </span>
                            </div>
                          </div>
                          <span className="font-mono text-xs font-black bg-neutral-100 px-1.5 py-0.5 border border-dashed border-neutral-300">
                            ${item.estimatedCost.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center p-6 text-center text-xs text-neutral-400 font-mono italic border border-dashed border-[#141414]/20 bg-white">
                    Pantry is self-sustaining. No extra grocery purchase needed.
                  </div>
                )}
              </div>

              {/* Real-time Budget Status widget */}
              {mealPlan && (
                <div className="p-4 bg-white border-t-2 border-[#141414] font-mono text-xs space-y-2">
                  <div className="flex justify-between items-center text-neutral-600 text-[10px] uppercase">
                    <span>Limit Allowance</span>
                    <span>Actual Spend Required</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-neutral-800">${dailyBudget}.00</span>
                    <span className={`text-[#141414] font-black text-xl font-serif italic ${isOverBudget ? "text-red-700" : ""}`}>
                      ${totalPurchaseCost.toFixed(2)}
                    </span>
                  </div>

                  <div className="h-2.5 w-full bg-[#E4E3E0] relative border border-[#141414] overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${isOverBudget ? 'bg-red-700' : 'bg-[#141414]'}`} 
                      style={{ width: `${Math.min(100, (totalPurchaseCost / dailyBudget) * 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 justify-between text-[10px] pt-1">
                    <span className="text-neutral-500">
                      {isOverBudget ? "Deficit amount:" : "Surplus leftover:"}
                    </span>
                    <span className={`font-bold ${isOverBudget ? "text-red-700" : "text-emerald-700"}`}>
                      ${overrunOrSaving.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Cabinet Quick Toggles panel */}
            <div className="border-t-2 border-[#141414] bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] font-bold uppercase text-neutral-500">
                  Quick Fridge Cabinet Toggles
                </span>
                <input
                  type="text"
                  placeholder="Filter stock list..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="font-mono text-[9px] border border-neutral-300 px-1.5 py-0.5 max-w-[120px] focus:outline-none focus:border-[#141414]"
                />
              </div>

              <div className="flex flex-wrap gap-1 max-h-[140px] overflow-y-auto pr-1">
                {filteredPopular.map((item) => {
                  const isSelected = availableGroceries.some(g => g.toLowerCase() === item.name.toLowerCase());
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleTogglePopular(item.name)}
                      className={`font-mono text-[10px] px-2 py-1 border transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-[#141414] text-white border-[#141414] font-semibold' 
                          : 'bg-stone-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                      id={`toggle-popular-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {item.name} {isSelected ? "✓" : "+"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SUBSTITUTES & ALTERNATES PROTOCOLS */}
            <div className="border-t-2 border-[#141414] flex-1 flex flex-col min-h-[220px]">
              <div className="bg-[#141414]/5 px-5 py-3 border-b-2 border-[#141414] flex items-center justify-between">
                <span className="font-serif italic font-bold text-sm uppercase tracking-wide">
                  IV. Substitute Meal Vectors
                </span>
                <span className="font-mono text-[10px] text-neutral-500">
                  Stock Substitutes
                </span>
              </div>

              <div className="p-4 flex-1 overflow-y-auto space-y-2">
                {mealPlan && mealPlan.alternateMeals.length > 0 ? (
                  mealPlan.alternateMeals.map((alt, idx) => {
                    const isExpanded = activeExpandedAlt === idx;
                    return (
                      <div key={idx} className="border border-[#141414] bg-white p-3 space-y-2" id={`alt-vector-${idx}`}>
                        <div 
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => setActiveExpandedAlt(isExpanded ? null : idx)}
                        >
                          <div>
                            <span className="inline-block text-[9px] font-mono font-bold bg-[#141414] text-white px-1 py-0.2 uppercase mb-1">
                              ALT {alt.mealCategory.toUpperCase()}
                            </span>
                            <h4 className="font-serif italic font-extrabold text-sm text-[#141414]">
                              {alt.name}
                            </h4>
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-800" /> : <ChevronDown className="w-4 h-4 text-neutral-800" />}
                        </div>

                        {isExpanded && (
                          <div className="space-y-2 border-t border-dashed border-[#141414]/15 pt-2 text-xs font-mono">
                            <p className="text-neutral-500 italic text-[11px] leading-tight">
                              💡 "{alt.whyItIsAGoodAlternative}"
                            </p>
                            <div className="bg-[#E4E3E0]/30 p-2 border border-[#141414]/10">
                              <span className="text-[9px] font-bold text-neutral-500 block mb-1">Substituted Ingredients Used</span>
                              <p className="text-neutral-800 text-[10px]">{alt.description}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-neutral-500 block">Fast Cook Steps</span>
                              <ul className="list-disc pl-4 space-y-1 text-[10px] text-neutral-700">
                                {alt.instructions.map((inst, i) => (
                                  <li key={i}>{inst}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex items-center justify-center p-6 text-center text-xs text-neutral-400 font-mono italic border border-dashed border-[#141414]/20 bg-stone-50">
                    No alternate substitutes calculated yet. Run the optimizing generator to analyze fridge surplus.
                  </div>
                )}
              </div>
            </div>

          </section>

        </div>

      </div>

      {/* Humble Footer Statement */}
      <footer className="mt-8 text-center" id="app-footer">
        <p className="text-xs font-mono text-neutral-600">
          * Dynamic item prices are approximation layers generated dynamically by AI based on localized consumer estimates.
        </p>
        <p className="text-[10px] font-mono text-neutral-400 mt-1">
          Designed with Editorial High Density Minimalist Aesthetics // Standard Node App Port Routing
        </p>
      </footer>

    </div>
  );
}
