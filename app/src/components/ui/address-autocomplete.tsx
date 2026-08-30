"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { environments } from "@/config/environments";

export interface ParsedAddress {
  placeId: string;
  formattedAddress: string;
  streetAddress?: string;
  subpremise?: string;
  city?: string;
  state?: string;
  stateCode?: string;
  postalCode?: string;
  country?: string;
  countryCode?: string;
  lat?: number;
  lng?: number;
}

export interface AddressAutocompleteProps
  extends Omit<React.ComponentProps<typeof Input>, "value" | "onChange"> {
  value: string;
  onValueChange: (value: string) => void;
  onPlaceSelect?: (address: ParsedAddress) => void;
}

interface SuggestionItem {
  label: string;
  value: string;
}

const PLACES_API_BASE = "https://places.googleapis.com/v1/places";
const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_MS = 300;

async function fetchSuggestions(
  query: string,
  sessionToken: string,
  apiKey: string,
  signal: AbortSignal
): Promise<SuggestionItem[]> {
  const response = await fetch(`${PLACES_API_BASE}:autocomplete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
    },
    body: JSON.stringify({ input: query, sessionToken }),
    signal,
  });

  if (!response.ok) return [];

  const data = await response.json();
  const suggestions: Array<{
    placePrediction?: { placeId?: string; text?: { text?: string } };
  }> = data.suggestions ?? [];

  return suggestions
    .map((suggestion) => suggestion.placePrediction)
    .filter((prediction): prediction is NonNullable<typeof prediction> => !!prediction?.placeId)
    .map((prediction) => ({
      value: prediction.placeId as string,
      label: prediction.text?.text ?? "",
    }));
}

type AddressComponent = { types?: string[]; longText?: string; shortText?: string };

function getAddressComponent(
  components: AddressComponent[],
  type: string,
  useShortText = false
) {
  const component = components.find((item) => item.types?.includes(type));
  return useShortText ? component?.shortText : component?.longText;
}

function parsePlace(place: {
  id?: string;
  formattedAddress?: string;
  addressComponents?: AddressComponent[];
  location?: { latitude?: number; longitude?: number };
}): ParsedAddress {
  const components = place.addressComponents ?? [];
  const streetAddress = [
    getAddressComponent(components, "street_number"),
    getAddressComponent(components, "route"),
  ]
    .filter(Boolean)
    .join(" ");

  return {
    placeId: place.id ?? "",
    formattedAddress: place.formattedAddress ?? "",
    streetAddress: streetAddress || undefined,
    subpremise: getAddressComponent(components, "subpremise"),
    city:
      getAddressComponent(components, "locality") ??
      getAddressComponent(components, "postal_town"),
    state: getAddressComponent(components, "administrative_area_level_1"),
    stateCode: getAddressComponent(components, "administrative_area_level_1", true),
    postalCode: getAddressComponent(components, "postal_code"),
    country: getAddressComponent(components, "country"),
    countryCode: getAddressComponent(components, "country", true),
    lat: place.location?.latitude,
    lng: place.location?.longitude,
  };
}

async function fetchPlaceDetails(
  placeId: string,
  sessionToken: string,
  apiKey: string
): Promise<ParsedAddress | null> {
  const response = await fetch(
    `${PLACES_API_BASE}/${placeId}?sessionToken=${sessionToken}`,
    {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "id,formattedAddress,addressComponents,location",
      },
    }
  );

  if (!response.ok) return null;

  return parsePlace(await response.json());
}

export function AddressAutocomplete({
  value,
  onValueChange,
  onPlaceSelect,
  className,
  ...rest
}: AddressAutocompleteProps) {
  const apiKey = environments.googleMapsApiKey;
  const [suggestions, setSuggestions] = React.useState<SuggestionItem[]>([]);
  const [status, setStatus] = React.useState<"idle" | "loading" | "empty">("idle");
  const sessionTokenRef = React.useRef(crypto.randomUUID());
  const lastAppliedValueRef = React.useRef<string | null>(null);
  const abortRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    if (!apiKey || value === lastAppliedValueRef.current) return;

    const query = value.trim();
    if (query.length < MIN_QUERY_LENGTH) return;

    const timeout = setTimeout(() => {
      setStatus("loading");
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      fetchSuggestions(query, sessionTokenRef.current, apiKey, controller.signal)
        .then((results) => {
          setSuggestions(results);
          setStatus(results.length ? "idle" : "empty");
        })
        .catch((error) => {
          if (error instanceof DOMException && error.name === "AbortError") return;
          setSuggestions([]);
          setStatus("empty");
        });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [value, apiKey]);

  const handleSelectedValueChange = (item: SuggestionItem | null) => {
    if (!item || !apiKey) return;

    const sessionToken = sessionTokenRef.current;
    fetchPlaceDetails(item.value, sessionToken, apiKey).then((parsed) => {
      if (!parsed) return;
      lastAppliedValueRef.current = parsed.formattedAddress;
      setSuggestions([]);
      onValueChange(parsed.formattedAddress);
      onPlaceSelect?.(parsed);
      sessionTokenRef.current = crypto.randomUUID();
    });
  };

  if (!apiKey) {
    return (
      <Input
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className={className}
        {...rest}
      />
    );
  }

  const queryTooShort = value.trim().length < MIN_QUERY_LENGTH;
  const items = queryTooShort ? [] : suggestions;
  const emptyMessage = queryTooShort
    ? `Type at least ${MIN_QUERY_LENGTH} characters`
    : status === "loading"
      ? "Searching…"
      : "No matches found";

  return (
    <Combobox
      items={items}
      inputValue={value}
      onInputValueChange={onValueChange}
      onValueChange={handleSelectedValueChange}
      filter={null}
      itemToStringLabel={(item: SuggestionItem) => item.label}
    >
      <ComboboxInput className={className} showTrigger={false} {...rest} />
      <ComboboxContent>
        <ComboboxList>
          {(item: SuggestionItem) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  );
}
