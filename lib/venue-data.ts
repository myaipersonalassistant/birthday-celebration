export type NearbyHotel = {
  id: string;
  name: string;
  area: string;
  walkTime: string;
  distance: string;
  vibe: string;
  highlight: string;
  image: string;
  mapsUrl: string;
  bookingUrl: string;
  featured?: boolean;
};

export const eventDateLabel = "Friday, 7 August 2026";

/** GetYourGuide · Barcelona — browse more stays, tours & local options */
export const exploreBarcelonaUrl = "https://www.getyourguide.com/barcelona-l45/";

/** Evening celebration — Purobeach at Hilton Diagonal Mar */
export const eveningVenue = {
  name: "Purobeach Barcelona",
  host: "Hilton Diagonal Mar Barcelona",
  shortLabel: "Purobeach · Hilton Diagonal Mar",
  scriptLabel: "Evening celebration",
  timeLabel: "From 6:30 PM",
  dressCode: "Elegant",
  addressLines: ["Pg. del Taulat, 262, 264", "Sant Martí, 08019 Barcelona, Spain"],
  mapsUrl: "https://maps.google.com/?q=Purobeach+Barcelona+Hilton+Diagonal+Mar",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Purobeach%20Barcelona%20Hilton%20Diagonal%20Mar&z=15&output=embed",
  blurb:
    "Birthday dinner at Purobeach Barcelona, within Hilton Diagonal Mar — fellowship, music, and speeches. Please arrive promptly. Dress code: elegant.",
};

/** Daytime cruise meetup — Port Olímpic marina */
export const marinaVenue = {
  name: "Port Olímpic Marina",
  scriptLabel: "Day · Catamaran",
  timeLabel: "Arrive by 1:00 PM",
  sailWindow: "Cruise 2:00 – 3:00 PM",
  meetingPoint: "Moll de Mestral, Berths 1524–1527",
  addressLines: ["Moll de Mestral, Berths 1524–1527", "Port Olímpic, 08005 Barcelona"],
  boatNames: ["White Satin", "Oceanus", "Izabal", "Samui"] as const,
  mapsUrl: "https://goo.gl/maps/7HovgEsEedaxDseA7",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Moll%20de%20Mestral%20Port%20Ol%C3%ADmpic%20Barcelona&z=16&output=embed",
  blurb:
    "Check in with the crew, welcome photos, and light refreshments before a private one-hour sail along the coast — music, drinks, and snacks included.",
  freeTimeNote:
    "From 3:00 PM to 6:30 PM, return to your hotel, explore, or freshen up before dinner.",
};

/** Six recommended stays near Purobeach / Hilton Diagonal Mar & Port Olímpic */
export const nearbyHotels: NearbyHotel[] = [
  {
    id: "hilton-diagonal-mar",
    name: "Hilton Diagonal Mar Barcelona",
    area: "Diagonal Mar",
    walkTime: "On site",
    distance: "0 min",
    vibe: "Celebration base",
    highlight:
      "Wake up steps from Purobeach and the evening celebration, with an easy link to Port Olímpic for the cruise.",
    image: "/hotels/hilton-diagonal-mar.jpg",
    mapsUrl: "https://maps.google.com/?q=Hilton+Diagonal+Mar+Barcelona",
    bookingUrl: "https://www.hilton.com/en/hotels/bcndmhi-hilton-diagonal-mar-barcelona/",
    featured: true,
  },
  {
    id: "sb-diagonal-zero",
    name: "Hotel SB Diagonal Zero",
    area: "Forum / Diagonal Mar",
    walkTime: "5 min walk",
    distance: "~400 m",
    vibe: "Modern & quiet",
    highlight:
      "Contemporary rooms beside the Forum — a short stroll along the seafront to Purobeach & Hilton.",
    image: "/hotels/sb-diagonal-zero.jpg",
    mapsUrl: "https://maps.google.com/?q=Hotel+SB+Diagonal+Zero+Barcelona",
    bookingUrl: "https://www.sb-hotels.com/en/hotels/barcelona/diagonal-zero/",
  },
  {
    id: "barcelona-princess",
    name: "Hotel Barcelona Princess",
    area: "Diagonal Mar",
    walkTime: "7 min walk",
    distance: "~550 m",
    vibe: "Skyline views",
    highlight:
      "A Diagonal Mar favourite with rooftop energy and an easy walk to Purobeach & Hilton.",
    image: "/hotels/barcelona-princess.jpg",
    mapsUrl: "https://maps.google.com/?q=Hotel+Barcelona+Princess",
    bookingUrl: "https://www.hotelbarcelonaprincess.com/",
  },
  {
    id: "front-maritim",
    name: "Hotel Front Marítim Barcelona",
    area: "Sant Martí Beach",
    walkTime: "9 min walk",
    distance: "~700 m",
    vibe: "Beachfront calm",
    highlight:
      "Sea-facing stay on Passeig de Garcia Fària — ideal if you want sand between you and the party.",
    image: "/hotels/front-maritim.jpg",
    mapsUrl: "https://maps.google.com/?q=Hotel+Front+Maritim+Barcelona",
    bookingUrl: "https://www.hotelfrontmaritim.com/",
  },
  {
    id: "ac-forum",
    name: "Leonardo Royal Hotel Barcelona Forum",
    area: "Forum",
    walkTime: "11 min walk",
    distance: "~900 m",
    vibe: "Polished & practical",
    highlight:
      "Formerly AC Hotel Barcelona Forum — a comfortable base by the Forum with a gentle walk to the evening venue.",
    image: "/hotels/ac-forum.jpg",
    mapsUrl: "https://maps.google.com/?q=Leonardo+Royal+Hotel+Barcelona+Forum",
    bookingUrl: "https://www.leonardo-hotels.com/barcelona/leonardo-royal-hotel-barcelona-forum",
  },
  {
    id: "pullman-skipper",
    name: "Pullman Barcelona Skipper",
    area: "Port Olímpic",
    walkTime: "Near marina",
    distance: "~1.8 km to Hilton",
    vibe: "Harbour luxury",
    highlight:
      "Upscale harbour hotel beside Port Olímpic — ideal for the catamaran meetup, then a short taxi to Purobeach & Hilton for dinner.",
    image: "/hotels/pullman-skipper.jpg",
    mapsUrl: "https://maps.google.com/?q=Pullman+Barcelona+Skipper",
    bookingUrl: "https://all.accor.com/hotel/5309/index.en.shtml",
  },
];

export const arrivalNotes = [
  {
    title: "Day · Marina",
    detail:
      "Aim for Moll de Mestral, berths 1524–1527, Port Olímpic by 1:00 PM. Taxi or walk from nearby harbour hotels; use the marina maps link below.",
  },
  {
    title: "Evening · Purobeach & Hilton",
    detail:
      "Ask for Purobeach Barcelona or Hilton Diagonal Mar (Pg. del Taulat, 262–264) — they share the same waterfront address. Metro L4 to El Maresme | Fòrum, then a short walk.",
  },
  {
    title: "From the Airport",
    detail:
      "About 25–35 minutes by taxi from BCN, depending on traffic. Tram + metro is also an option for either location.",
  },
];
