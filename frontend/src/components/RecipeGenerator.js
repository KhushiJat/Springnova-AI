import React, { useState } from "react";
import { Utensils } from "lucide-react";

function RecipeGenerator() {
    const [ingredients, setIngredients] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [dietaryRestrictions, setDietaryRestrictions] = useState('');
    const [recipe, setRecipe] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Get current username from localStorage
    const savedUser = JSON.parse(localStorage.getItem("springnova_user"));
    const username = savedUser ? savedUser.username : "guest";

    const createRecipe = async () => {
        setIsLoading(true);
        try {
            // Added &username=${username} to the query parameters
            const response = await fetch(`http://localhost:8080/recipe-creator?ingredients=${encodeURIComponent(ingredients)}&dietaryRestrictions=${encodeURIComponent(dietaryRestrictions)}&cuisine=${encodeURIComponent(cuisine || 'any')}&username=${username}`);
            const data = await response.text();
            setRecipe(data);
        } catch (error) {
            console.error("Error generating recipe : ", error);
            setRecipe("Error creating recipe. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={{ ...styles.headerTitle, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Utensils size={22} color="#f59e0b" /> Recipe Generator
            </h2>
            
            <div style={styles.inputCard}>
                <div style={styles.row}>
                    <input
                        type="text"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        placeholder="Ingredients (comma separated)"
                        style={styles.inputField}
                    />
                    <input
                        type="text"
                        value={cuisine}
                        onChange={(e) => setCuisine(e.target.value)}
                        placeholder="Cuisine type (optional)"
                        style={styles.inputField}
                    />
                </div>
                <input
                    type="text"
                    value={dietaryRestrictions}
                    onChange={(e) => setDietaryRestrictions(e.target.value)}
                    placeholder="Dietary restrictions (e.g., vegan, gluten-free)"
                    style={styles.inputField}
                />
                <button onClick={createRecipe} disabled={isLoading} style={styles.primaryBtn}>
                    {isLoading ? "Cooking up recipe..." : "Create Recipe"}
                </button>
            </div>

            {(recipe || isLoading) && (
                <div style={styles.outputCard}>
                    <span style={styles.outputLabel}>Generated Recipe</span>
                    {isLoading ? (
                        <p style={{ color: '#aaa', fontStyle: 'italic', marginTop: '8px' }}>Crafting your custom recipe...</p>
                    ) : (
                        <pre style={styles.recipeText}>{recipe}</pre>
                    )}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { maxWidth: '750px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' },
    headerTitle: { fontSize: '24px', fontWeight: '600', color: '#fff', marginBottom: '10px' },
    inputCard: { backgroundColor: '#212121', border: '1px solid #333', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
    row: { display: 'flex', gap: '12px' },
    inputField: { flex: 1, backgroundColor: '#2f2f2f', border: '1px solid #424242', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none' },
    primaryBtn: { alignSelf: 'flex-end', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '20px', padding: '10px 20px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
    outputCard: { backgroundColor: '#2f2f2f', border: '1px solid #424242', borderRadius: '12px', padding: '20px' },
    outputLabel: { fontSize: '11px', textTransform: 'uppercase', color: '#888', letterSpacing: '1px' },
    recipeText: { color: '#fff', fontSize: '14px', fontFamily: 'inherit', whiteSpace: 'pre-wrap', marginTop: '8px', lineHeight: '1.5' }
};

export default RecipeGenerator;