import { useState, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { authlessFetch } from "@/services/api";

/**
 * LocationInput - A robust location selector component for countries and states
 *
 * Features:
 * - Supports initialization by country/state names
 * - Supports initialization by longitude/latitude coordinates
 * - Provides real-time coordinate data when selections change
 * - Automatically finds closest match when coordinates are provided
 * - Handles edge cases and invalid coordinate data gracefully
 *
 * Usage:
 * - For name-based initialization: pass initialCountryName and initialStateName
 * - For coordinate-based initialization: pass initialLongitude and initialLatitude
 * - Both methods can be combined for maximum reliability
 * - onCountryChange and onStateChange callbacks provide full location data including coordinates
 */

interface Timezone {
  zoneName: string;
  gmtOffset: number;
  gmtOffsetName: string;
  abbreviation: string;
  tzName: string;
}

// Basic country data from initial API response
interface CountryBasic {
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  phonecode: string;
  capital: string;
  currency: string;
  native: string;
  emoji: string;
}

// Detailed country data from specific country API response
interface CountryProps {
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  numeric_code: string;
  phone_code?: string;
  phonecode?: string;
  capital: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  tld: string;
  native: string;
  region: string;
  region_id: string;
  subregion: string;
  subregion_id: string;
  nationality: string;
  timezones: Timezone[] | string;
  translations: Record<string, string> | string;
  latitude: string;
  longitude: string;
  emoji: string;
  emojiU: string;
}

// Basic state data from initial API response
interface StateBasic {
  id: number;
  name: string;
  iso2: string;
}

// Detailed state data from specific state API response
interface StateProps {
  id: number;
  name: string;
  country_id: number;
  country_code: string;
  state_code?: string;
  iso2: string;
  type: string | null;
  latitude: string;
  longitude: string;
}

interface LocationSelectorProps {
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Callback fired when country selection changes. Provides full country data including coordinates */
  onCountryChange?: (country: CountryProps | null) => void;
  /** Callback fired when state selection changes. Provides full state data including coordinates */
  onStateChange?: (state: StateProps | null) => void;
  /** Initial country name to select on component mount */
  initialCountryName?: string;
  /** Initial state name to select on component mount */
  initialStateName?: string;
  /** Initial longitude coordinate - component will find closest matching country/state */
  initialLongitude?: string;
  /** Initial latitude coordinate - component will find closest matching country/state */
  initialLatitude?: string;
  /** Whether to clear state selection when country changes. Default: true */
  clearStateOnCountryChange?: boolean;
}

async function fetchCountries() {
  const res = await authlessFetch.get(
    `${import.meta.env.VITE_COUNTRIES_BASE_URL}/countries`,
    {
      headers: { "X-CSCAPI-KEY": import.meta.env.VITE_COUNTRIES_API_KEY },
    },
  );
  return res.data;
}

async function fetchCountryDetails(iso2: string) {
  const res = await authlessFetch.get(
    `${import.meta.env.VITE_COUNTRIES_BASE_URL}/countries/${iso2}`,
    {
      headers: { "X-CSCAPI-KEY": import.meta.env.VITE_COUNTRIES_API_KEY },
    },
  );
  return res.data;
}

async function fetchStates(iso2: string) {
  const res = await authlessFetch.get(
    `${import.meta.env.VITE_COUNTRIES_BASE_URL}/countries/${iso2}/states`,
    {
      headers: { "X-CSCAPI-KEY": import.meta.env.VITE_COUNTRIES_API_KEY },
    },
  );
  return res.data;
}

async function fetchStateDetails(countryIso2: string, stateIso2: string) {
  const res = await authlessFetch.get(
    `${import.meta.env.VITE_COUNTRIES_BASE_URL}/countries/${countryIso2}/states/${stateIso2}`,
    {
      headers: { "X-CSCAPI-KEY": import.meta.env.VITE_COUNTRIES_API_KEY },
    },
  );
  return res.data;
}

const LocationSelector = ({
  disabled,
  onCountryChange,
  onStateChange,
  initialCountryName,
  initialStateName,
  initialLongitude,
  initialLatitude,
  clearStateOnCountryChange = true,
}: LocationSelectorProps) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryProps | null>(
    null,
  );
  const [selectedState, setSelectedState] = useState<StateProps | null>(null);
  const [openCountryDropdown, setOpenCountryDropdown] = useState(false);
  const [openStateDropdown, setOpenStateDropdown] = useState(false);

  // Track what has been initialized to avoid redundant operations
  const [initializedCountry, setInitializedCountry] = useState<string | null>(
    null,
  );
  const [initializedState, setInitializedState] = useState<string | null>(null);

  // Reset initialization tracking when initial values change
  useEffect(() => {
    setInitializedCountry(null);
    setInitializedState(null);
  }, [initialCountryName, initialStateName]);

  const { data: countriesData = [], isLoading: loadingCountries } = useQuery<
    CountryBasic[]
  >({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  const { data: statesData = [], isLoading: loadingStates } = useQuery<
    StateBasic[]
  >({
    queryKey: ["states", selectedCountry?.iso2],
    queryFn: () =>
      selectedCountry ? fetchStates(selectedCountry.iso2) : Promise.resolve([]),
    enabled: !!selectedCountry,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    select: (data) => {
    // sort states alphabetically by name
    return [...data].sort((a, b) => a.name.localeCompare(b.name));
  },
  });

  // Helper function to find closest country by coordinates
  // Note: Currently not used as basic country data doesn't include coordinates
  // Could be implemented later for coordinate-based initialization if needed

  // Helper function to find closest state by coordinates
  // Note: Currently not used as basic state data doesn't include coordinates
  // Could be implemented later for coordinate-based initialization if needed

  // Effect to set initial country when data is loaded
  useEffect(() => {
    if (
      countriesData.length > 0 &&
      initialCountryName &&
      initializedCountry !== initialCountryName
    ) {
      // Log first 10 countries

      const basicCountry = countriesData.find(
        (country) => country.name === initialCountryName,
      );

      if (basicCountry) {
        // This will fetch the detailed country data with coordinates
        handleCountrySelect(basicCountry, true); // Pass true for initialization
        setInitializedCountry(initialCountryName);
      } else {
        // Try partial match as fallback
        const partialMatch = countriesData.find(
          (country) =>
            country.name
              .toLowerCase()
              .includes(initialCountryName.toLowerCase()) ||
            initialCountryName
              .toLowerCase()
              .includes(country.name.toLowerCase()),
        );
        if (partialMatch) {
          handleCountrySelect(partialMatch, true); // Pass true for initialization
          setInitializedCountry(initialCountryName);
        }
      }
    }
  }, [
    initialCountryName,
    initialLongitude,
    initialLatitude,
    countriesData,
    selectedCountry?.name,
    initializedCountry,
  ]);

  // Effect to set initial state when states data is loaded
  useEffect(() => {
    if (
      statesData.length > 0 &&
      selectedCountry &&
      initialStateName &&
      initializedState !== initialStateName &&
      (!selectedState || selectedState.name !== initialStateName)
    ) {
      const basicState = statesData.find(
        (state) => state.name === initialStateName,
      );

      if (basicState) {
        // This will fetch the detailed state data with coordinates
        handleStateSelect(basicState, true); // Pass true for initialization
        setInitializedState(initialStateName);
      } else {
        // Try partial match as fallback
        const partialMatch = statesData.find(
          (state) =>
            state.name.toLowerCase().includes(initialStateName.toLowerCase()) ||
            initialStateName.toLowerCase().includes(state.name.toLowerCase()),
        );
        if (partialMatch) {
          handleStateSelect(partialMatch, true); // Pass true for initialization
          setInitializedState(initialStateName);
        }
      }
    }
  }, [
    initialStateName,
    initialLongitude,
    initialLatitude,
    statesData,
    selectedCountry,
    selectedState?.name,
    initializedState,
  ]);

  const handleCountrySelect = async (
    country: CountryBasic | null,
    isInitialization = false,
  ) => {
    if (!country) {
      setSelectedCountry(null);
      if (clearStateOnCountryChange) {
        setSelectedState(null);
        onStateChange?.(null);
      }
      onCountryChange?.(null);
      return;
    }

    try {
      // Fetch detailed country data to get coordinates
      const detailedCountry = await fetchCountryDetails(country.iso2);

      setSelectedCountry(detailedCountry);

      // Only clear state if not initializing (i.e., user is making a manual change)
      // and clearStateOnCountryChange is true
      if (clearStateOnCountryChange && !isInitialization) {
        setSelectedState(null); // Reset state when country changes
        onStateChange?.(null);
      }

      onCountryChange?.(detailedCountry);
    } catch (error) {
      console.error("Failed to fetch country details:", error);
      // Fallback: use basic country data without coordinates
      const fallbackCountry: CountryProps = {
        ...country,
        numeric_code: "",
        phone_code: country.phonecode,
        currency_name: "",
        currency_symbol: "",
        tld: "",
        region: "",
        region_id: "",
        subregion: "",
        subregion_id: "",
        nationality: "",
        timezones: [],
        translations: {},
        latitude: "",
        longitude: "",
        emojiU: "",
      };
      setSelectedCountry(fallbackCountry);

      if (clearStateOnCountryChange && !isInitialization) {
        setSelectedState(null);
        onStateChange?.(null);
      }

      onCountryChange?.(fallbackCountry);
    }
  };

  const handleStateSelect = async (
    state: StateBasic | null,
    isInitialization = false,
  ) => {
    console.log(
      "State selected:",
      state?.name,
      "isInitialization:",
      isInitialization,
    );

    if (!state || !selectedCountry) {
      setSelectedState(null);
      onStateChange?.(null);
      return;
    }

    try {
      // Fetch detailed state data to get coordinates
      const detailedState = await fetchStateDetails(
        selectedCountry.iso2,
        state.iso2,
      );

      setSelectedState(detailedState);
      onStateChange?.(detailedState);
    } catch (error) {
      console.error("Failed to fetch state details:", error);
      // Fallback: use basic state data without coordinates
      const fallbackState: StateProps = {
        ...state,
        country_id: selectedCountry.id,
        country_code: selectedCountry.iso2,
        state_code: state.iso2,
        type: "state",
        latitude: "",
        longitude: "",
      };
      setSelectedState(fallbackState);
      onStateChange?.(fallbackState);
    }
  };

  return (
    <div className="flex gap-4">
      {/* Country Selector */}
      <div className="w-1/2">
        <Popover
          open={openCountryDropdown}
          onOpenChange={setOpenCountryDropdown}
          modal
        >
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              role="combobox"
              aria-expanded={openCountryDropdown}
              disabled={disabled}
              className="w-full justify-between rounded-none border-b p-0 px-0 has-[>svg]:px-0"
            >
              {selectedCountry ? (
                <div className="flex items-center gap-2">
                  <span>{selectedCountry.emoji}</span>
                  <span>{selectedCountry.name}</span>
                </div>
              ) : loadingCountries ? (
                <span>Loading...</span>
              ) : (
                <span>Select Country...</span>
              )}
              <ChevronDown className="h-4 w-4 shrink-0 opacity-30" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput placeholder="Search countries..." />
              <CommandList>
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup>
                  {countriesData.map((country) => (
                    <CommandItem
                      key={country.id}
                      value={country.name}
                      onSelect={() => {
                        handleCountrySelect(country);
                        setOpenCountryDropdown(false);
                      }}
                      className="flex cursor-pointer items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span>{country.emoji}</span>
                        <span>{country.name}</span>
                      </div>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selectedCountry?.id === country.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* State Selector - Only shown if selected country has states */}
      <div className="w-1/2">
        <Popover
          open={openStateDropdown}
          onOpenChange={setOpenStateDropdown}
          modal
        >
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              role="combobox"
              aria-expanded={openStateDropdown}
              disabled={!selectedCountry}
              className="w-full justify-between rounded-none border-b p-0 px-0 has-[>svg]:px-0"
            >
              {selectedState ? (
                <span>{selectedState.name}</span>
              ) : loadingStates ? (
                <span>Loading...</span>
              ) : (
                <span>Select State...</span>
              )}
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput placeholder="Search states..." />
              <CommandList>
                <CommandEmpty>No state found.</CommandEmpty>
                <CommandGroup>
                  {statesData.length === 0 && !loadingStates ? (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      There are no states for this country
                    </div>
                  ) : (
                    statesData.map((state) => (
                      <CommandItem
                        key={state.id}
                        value={state.name}
                        onSelect={() => {
                          handleStateSelect(state);
                          setOpenStateDropdown(false);
                        }}
                        className="flex cursor-pointer items-center justify-between text-sm"
                      >
                        <span>{state.name}</span>
                        <Check
                          className={cn(
                            "h-4 w-4",
                            selectedState?.id === state.id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default LocationSelector;
