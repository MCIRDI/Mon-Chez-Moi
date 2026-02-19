import { useState, useRef, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { US_STATES } from "@/data/usStates";

interface AutocompleteSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function AutocompleteSearch({ 
  onSearch, 
  placeholder = "Enter a state from the USA",
  className = ""
}: AutocompleteSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on query
  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = US_STATES.filter(state =>
      state.toLowerCase().startsWith(query.toLowerCase())
    ).slice(0, 8); // Limit to 8 suggestions

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    setSelectedIndex(-1);
  }, [query]);

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          setQuery(suggestions[selectedIndex]);
          onSearch(suggestions[selectedIndex]);
          setShowSuggestions(false);
        } else {
          handleSubmit(e as any);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="bg-white flex items-center rounded-2xl shadow-lg p-3 w-full">
        <Search className="text-slate-800 flex-shrink-0" />
        <form onSubmit={handleSubmit} className="flex w-full">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            placeholder={placeholder}
            className="ml-2 w-full border-none outline-none bg-transparent placeholder-slate-800"
          />
        </form>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors ${
                index === selectedIndex
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-gray-50"
              }`}
            >
              <MapPin size={16} className="text-gray-400" />
              <span className="text-sm font-medium">{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
