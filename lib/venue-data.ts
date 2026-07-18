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

export const venueDetails = {
  name: "Purobeach Barcelona",
  host: "Hilton Diagonal Mar Barcelona",
  addressLines: ["Pg. del Taulat, 262, 264", "Sant Martí, 08019 Barcelona, Spain"],
  mapsUrl: "https://maps.google.com/?q=Purobeach+Barcelona+Hilton+Diagonal+Mar",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Purobeach%20Barcelona%20Hilton%20Diagonal%20Mar&z=15&output=embed",
  dateLabel: "Friday, 7 August 2026",
  timeLabel: "7:00 PM",
};

export const nearbyHotels: NearbyHotel[] = [
  {
    id: "hilton-diagonal-mar",
    name: "Hilton Diagonal Mar Barcelona",
    area: "Diagonal Mar",
    walkTime: "On site",
    distance: "0 min",
    vibe: "Celebration base",
    highlight:
      "The celebration venue sits within this waterfront Hilton — wake up steps from Purobeach.",
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
      "Contemporary rooms beside the Forum — a short stroll along the seafront to the venue.",
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
      "A Diagonal Mar favourite with rooftop energy and an easy walk to Hilton & Purobeach.",
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
      "Formerly AC Hotel Barcelona Forum — a comfortable base by the Forum with a gentle walk to the venue.",
    image: "/hotels/ac-forum.jpg",
    mapsUrl: "https://maps.google.com/?q=Leonardo+Royal+Hotel+Barcelona+Forum",
    bookingUrl: "https://www.leonardo-hotels.com/barcelona/leonardo-royal-hotel-barcelona-forum",
  },
  {
    id: "pullman-skipper",
    name: "Pullman Barcelona Skipper",
    area: "Port Olímpic",
    walkTime: "4 min taxi",
    distance: "~1.8 km",
    vibe: "Harbour luxury",
    highlight:
      "Upscale harbour hotel with marina views — a quick taxi or tram hop to Diagonal Mar.",
    image: "/hotels/pullman-skipper.jpg",
    mapsUrl: "https://maps.google.com/?q=Pullman+Barcelona+Skipper",
    bookingUrl: "https://all.accor.com/hotel/5309/index.en.shtml",
  },
];

export const arrivalNotes = [
  {
    title: "By Metro",
    detail: "Line L4 to El Maresme | Fòrum, then a short walk toward Hilton Diagonal Mar.",
  },
  {
    title: "By Taxi / Ride",
    detail: "Ask for Hilton Diagonal Mar or Purobeach Barcelona — both share the same waterfront address.",
  },
  {
    title: "From the Airport",
    detail: "About 25–35 minutes by taxi from BCN, depending on traffic. Tram + metro is also an option.",
  },
];
