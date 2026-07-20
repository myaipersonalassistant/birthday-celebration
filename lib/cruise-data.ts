export const cruiseDetails = {
  title: "Celebration at Sea",
  ship: "MSC Grandiosa",
  nights: 7,
  startLabel: "Saturday, 8 August 2026",
  endLabel: "Saturday, 15 August 2026",
  dateRangeShort: "8–15 August 2026",
  departurePort: "Barcelona, Spain",
  returnPort: "Barcelona, Spain",
  optional: true,
  blurb:
    "After Angela’s special birthday celebration in Barcelona, guests are warmly invited to continue the experience with us aboard the magnificent MSC Grandiosa.",
  note: "This cruise is completely optional. Guests who would like to join us should make their own reservation directly with MSC Cruises. Prices and cabin availability may change — early booking is recommended.",
  bookingChecklist: [
    { label: "Departure port", value: "Barcelona" },
    { label: "Departure date", value: "8 August 2026" },
    { label: "Ship", value: "MSC Grandiosa" },
  ],
  /** Journey / itinerary details on MSC */
  mscItineraryUrl:
    "https://www.msccruises.co.uk/search/itinerary?embkPort=BCN&cruiseId=GR20260808BCNBCN&itineraryCode=UWVX&viewPrice=person&filterBy=relevance&objID=GR20260808BCNBCN%7CGBP%7C*%7CGBR%7C*%7C0%7C0%7C0%7C2%7CIB%7CGRF01074GB6014PR",
  /** Direct booking for this sailing */
  mscBookingUrl:
    "https://www.msccruises.co.uk/booking?bookingItinCd=UWVX&date=08%2F08%2F2026-15%2F08%2F2026&cruiseID=GR20260808BCNBCN&cabinType=INS&categoryKey=IB&priceType=PROMOMK1&priceCode=GRF01074GB6014PR&occupancy1=2%7C0%7C0%7Cfalse&isConnectedCabin=false&isFlightIncluded=false",
} as const;

export const cruiseItinerary = [
  { port: "Barcelona", country: "Spain", note: "Embark" },
  { port: "Cannes", country: "France", note: "French Riviera" },
  { port: "Genoa", country: "Italy", note: "Liguria" },
  { port: "La Spezia", country: "Italy", note: "Cinque Terre gateway" },
  { port: "Rome", country: "Italy", note: "Civitavecchia" },
  { port: "Palma de Mallorca", country: "Spain", note: "Balearics" },
  { port: "Barcelona", country: "Spain", note: "Return" },
] as const;
