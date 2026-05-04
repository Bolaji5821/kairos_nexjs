import { Search } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

export default function SearchJob({
  className,
  placeholder,
  onSearch,
}: {
  className?: string;
  placeholder?: string;
  onSearch?: (title: string, location: string) => void;
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  // Initialize search values from URL params
  useEffect(() => {
    const titleParam = searchParams.get("title") || "";
    const locationParam = searchParams.get("location") || "";
    setTitle(titleParam);
    setLocation(locationParam);
  }, [searchParams]);

  const handleSearch = () => {
    if (onSearch) {
      // If onSearch prop is provided, use it (for pages that handle search internally)
      onSearch(title, location);
    } else {
      // Otherwise, navigate to jobs page with search params (for dashboard)
      const params = new URLSearchParams();
      if (title.trim()) params.set("title", title.trim());
      if (location.trim()) params.set("location", location.trim());

      const searchString = params.toString();
      navigate(`/jobs${searchString ? `?${searchString}` : ""}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
      className={cn(
        "mt-3 h-[64px] lg:h-[74px] w-full rounded-3xl bg-white p-4",
        className,
      )}
    >
      <div className="flex gap-4 h-full">
        <div className="flex-1 h-full">
          <div className="relative h-full">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={
                placeholder ? placeholder : "Search for your perfect job"
              }
              className="pl-10 h-full !text-sm border-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <hr className="h-full border-l border-gray-200" />

        <div className="flex-1 h-full">
          <div className="relative h-full">
            <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Location"
              className="pl-10 h-full !text-sm border-none"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <div className="flex items-center">
          <button
            className="h-10 w-10 bg-custom-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-custom-blue-600 transition-colors cursor-pointer"
            onClick={handleSearch}
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
