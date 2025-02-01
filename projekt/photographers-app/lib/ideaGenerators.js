export const locations = [
  "Forest",
  "Beach",
  "Desert",
  "Mountains",
  "Countryside",
  "Abandoned Building",
  "Island",
  "Lake",
  "Restaurant",
  "Park",
  "Art Gallery",
  "City",
  "Village",
  "Cave",
  "River",
  "Waterfall",
  "Castle",
  "Museum",
  "Library",
  "Market",
  "Train Station",
  "Airport",
  "Hotel",
  "Farm",
  "Garden",
  "Street",
  "Bridge",
  "Skyscraper",
  "Zoo"
];

export const subjects = [
  "Artist",
  "Musician",
  "Chef",
  "Writer",
  "Architect",
  "Dancer",
  "Gardener",
  "Athlete",
  "Food",
  "Ant",
  "Dog",
  "Cat",
  "Car",
  "Bird",
  "Fish",
  "Horse",
  "Child",
  "Elderly Person",
  "Couple",
  "Family",
  "Friends",
  "Teacher",
  "Doctor",
  "Engineer",
  "Scientist",
  "Pilot",
  "Soldier",
  "Police Officer",
  "Firefighter",
  "Nurse"
];

export const colors = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "brown",
  "black",
  "gray",
  "white",
  "pink",
  "magenta",
  "lime",
  "indigo",
  "violet",
  "gold",
  "silver",
];

export const themes = [
  "Futuristic",
  "Minimalist",
  "Abstract",
  "Nature",
  "Surrealism",
  "Romantic",
  "Adventure",
  "Mystery",
  "Fantasy",
  "Horror",
  "Sci-Fi",
  "Historical",
  "Urban",
  "Vintage",
  "Modern",
  "Gothic",
  "Bohemian"
];

export function generateChallenge() {
  const challenges = [
    "Use a single source of light",
    "Include reflections in every shot",
    "Shoot from a very low angle",
    "Capture movement in every frame",
    "Take all photos within 10 minutes",
    "Focus on textures and patterns",
    "Use a wide-angle lens",
    "Capture emotions",
    "Incorporate shadows",
    "Capture symmetry",
    "Incorporate water in every shot"
  ];

  return challenges[Math.floor(Math.random() * challenges.length)];
}

export function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateLocation() {
  return getRandomItem(locations);
}

export function generatePerson() {
  return getRandomItem(subjects);
}

export function generateColor() {
  return getRandomItem(colors);
}

export function generateTheme() {
  return getRandomItem(themes);
}
