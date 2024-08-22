"use client";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { updateTheme } from "@/actions/user-progress";

interface ToggleCardProps {
  string: string;
}
const availableThemes: string[] = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
  ];
  // ... (previous imports and constants)

// ... (previous imports and constants)

export const Input = ({ string }: ToggleCardProps) => {
    const [inputValue, setInputValue] = useState<string>("");
    const [isPending, startTransition] = useTransition();
    const [suggestedThemes, setSuggestedThemes] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [inputClicked, setInputClicked] = useState(false);
  
    const onSaveClick = async () => {
      startTransition(() => {
        updateTheme(inputValue)
          .then(() => toast.success("Theme updated!"))
          .catch(() => toast.error("Something Went Wrong (Settings)"));
      });
    };
  
    const handleInputChange = (value: string) => {
      setInputValue(value);
  
      // Filter themes based on the input value
      const filteredThemes = availableThemes.filter((theme) =>
        theme.toLowerCase().includes(value.toLowerCase())
      );
  
      setSuggestedThemes(filteredThemes);
      setShowSuggestions(true);
    };
  
    const handleSuggestionClick = (theme: string) => {
      setInputValue(theme);
      setShowSuggestions(false);
    };
  
    const handleInputClick = () => {
      setInputClicked(true);
    };
  
    return (
      <div className="form-control gap-5">
        <input
          placeholder={string}
          className="input input-info text-accent"
          value={inputClicked ? inputValue : string}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            setShowSuggestions(true);
            handleInputClick();
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        {showSuggestions && (
          <div className="suggestions">
            {suggestedThemes.map((theme) => (
              <div
                key={theme}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(theme)}
              >
                {theme}
              </div>
            ))}
          </div>
        )}
        <button className="btn btn-outline" onClick={onSaveClick}>
          Save
        </button>
      </div>
    );
  };
  