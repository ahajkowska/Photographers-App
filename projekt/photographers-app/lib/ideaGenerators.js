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
  "Art Gallery"
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
  "Car"
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
];

export function generateChallenge() {
  const challenges = [
    "Use a single source of light",
    "Include reflections in every shot",
    "Shoot from a very low angle",
    "Capture movement in every frame",
    "Take all photos within 10 minutes",
    "Focus on textures and patterns",
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
