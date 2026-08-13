import { WordPair } from './types';

export interface ExtendedWordPair extends WordPair {
  hint: string;
  mainCategory?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export const CATEGORIES = [
  'Movies',
  'Food',
  'Animals',
  'Countries',
  'Technology',
  'Cricket',
  'Football',
  'Random',
] as const;

export type CategoryName = (typeof CATEGORIES)[number];

export const WORD_DICTIONARY: ExtendedWordPair[] = [
  // Movies & Entertainment
  { civilianWord: 'Avatar', imposterWord: 'Titanic', category: 'Movies', mainCategory: 'Movies', difficulty: 'Easy', hint: 'A blockbuster motion picture directed by James Cameron.' },
  { civilianWord: 'Star Wars', imposterWord: 'Star Trek', category: 'Movies', mainCategory: 'Movies', difficulty: 'Easy', hint: 'An iconic space sci-fi franchise featuring galactic battles.' },
  { civilianWord: 'Harry Potter', imposterWord: 'Lord of the Rings', category: 'Movies', mainCategory: 'Movies', difficulty: 'Easy', hint: 'A world-famous fantasy film series based on popular books.' },
  { civilianWord: 'Inception', imposterWord: 'Interstellar', category: 'Movies', mainCategory: 'Movies', difficulty: 'Medium', hint: 'A mind-bending Christopher Nolan cinematic masterpiece.' },
  { civilianWord: 'Marvel', imposterWord: 'DC Universe', category: 'Movies', mainCategory: 'Movies', difficulty: 'Medium', hint: 'A massive superhero movie cinematic universe.' },
  { civilianWord: 'Jurassic Park', imposterWord: 'King Kong', category: 'Movies', mainCategory: 'Movies', difficulty: 'Medium', hint: 'A creature feature blockbuster involving giant beasts.' },
  { civilianWord: 'The Godfather', imposterWord: 'Goodfellas', category: 'Movies', mainCategory: 'Movies', difficulty: 'Hard', hint: 'A legendary crime drama cinema classic.' },
  { civilianWord: 'Batman', imposterWord: 'Superman', category: 'Movies', mainCategory: 'Movies', difficulty: 'Easy', hint: 'A legendary comic book hero adapted into major films.' },

  // Food & Drinks
  { civilianWord: 'Apple', imposterWord: 'Mango', category: 'Fruits', mainCategory: 'Food', difficulty: 'Easy', hint: 'A sweet, juicy orchard fruit often enjoyed fresh or as juice.' },
  { civilianWord: 'Coffee', imposterWord: 'Tea', category: 'Beverages', mainCategory: 'Food', difficulty: 'Easy', hint: 'A popular hot caffeinated drink brewed around the world.' },
  { civilianWord: 'Pizza', imposterWord: 'Burger', category: 'Fast Food', mainCategory: 'Food', difficulty: 'Easy', hint: 'A classic savory fast-food favorite made with dough and toppings.' },
  { civilianWord: 'Pancake', imposterWord: 'Waffle', category: 'Breakfast', mainCategory: 'Food', difficulty: 'Medium', hint: 'A golden-brown cooked batter treat served with syrup.' },
  { civilianWord: 'Chocolate', imposterWord: 'Ice Cream', category: 'Desserts', mainCategory: 'Food', difficulty: 'Easy', hint: 'A sweet indulgence loved by children and adults alike.' },
  { civilianWord: 'Sushi', imposterWord: 'Ramen', category: 'Asian Cuisine', mainCategory: 'Food', difficulty: 'Medium', hint: 'A famous Japanese dish made with fresh ingredients and rice or broth.' },
  { civilianWord: 'Cake', imposterWord: 'Cupcake', category: 'Bakery', mainCategory: 'Food', difficulty: 'Easy', hint: 'A frosted sweet baked dessert sliced for celebrations.' },
  { civilianWord: 'Lemon', imposterWord: 'Lime', category: 'Citrus Fruits', mainCategory: 'Food', difficulty: 'Hard', hint: 'A sour citrus fruit with high vitamin C used in cooking and drinks.' },
  { civilianWord: 'Donut', imposterWord: 'Bagel', category: 'Bakery', mainCategory: 'Food', difficulty: 'Medium', hint: 'A ring-shaped baked or fried dough item eaten for breakfast or snacks.' },
  { civilianWord: 'Popcorn', imposterWord: 'Potato Chips', category: 'Snacks', mainCategory: 'Food', difficulty: 'Easy', hint: 'A crunchy salty snack popular at movie theaters and parties.' },
  { civilianWord: 'Milk', imposterWord: 'Smoothie', category: 'Beverages', mainCategory: 'Food', difficulty: 'Medium', hint: 'A creamy liquid drink packed with nutrients.' },
  { civilianWord: 'Pasta', imposterWord: 'Noodles', category: 'Carbs', mainCategory: 'Food', difficulty: 'Hard', hint: 'A staple wheat food served with sauce or seasoning.' },
  { civilianWord: 'Taco', imposterWord: 'Burrito', category: 'Mexican Food', mainCategory: 'Food', difficulty: 'Medium', hint: 'A tortilla wrapped around flavorful meats, beans, and salsa.' },
  { civilianWord: 'Butter', imposterWord: 'Cheese', category: 'Dairy', mainCategory: 'Food', difficulty: 'Hard', hint: 'A rich yellow dairy product made from milk or cream.' },

  // Animals & Nature
  { civilianWord: 'Lion', imposterWord: 'Tiger', category: 'Wild Cats', mainCategory: 'Animals', difficulty: 'Easy', hint: 'A majestic predatory wild big cat known for its hunting prowess.' },
  { civilianWord: 'Dolphin', imposterWord: 'Whale', category: 'Marine Life', mainCategory: 'Animals', difficulty: 'Easy', hint: 'An intelligent marine mammal swimming in ocean waters.' },
  { civilianWord: 'Falcon', imposterWord: 'Eagle', category: 'Birds of Prey', mainCategory: 'Animals', difficulty: 'Medium', hint: 'A sharp-eyed bird of prey known for soaring high.' },
  { civilianWord: 'Crocodile', imposterWord: 'Alligator', category: 'Reptiles', mainCategory: 'Animals', difficulty: 'Medium', hint: 'A large semi-aquatic predatory reptile with strong jaws.' },
  { civilianWord: 'Frog', imposterWord: 'Toad', category: 'Amphibians', mainCategory: 'Animals', difficulty: 'Easy', hint: 'A small hopping amphibian found near water and wetlands.' },
  { civilianWord: 'Horse', imposterWord: 'Zebra', category: 'Mammals', mainCategory: 'Animals', difficulty: 'Easy', hint: 'A four-legged hooved mammal known for running and riding.' },
  { civilianWord: 'Penguin', imposterWord: 'Puffin', category: 'Antarctic Birds', mainCategory: 'Animals', difficulty: 'Medium', hint: 'A flightless coastal bird suited for swimming in cold waters.' },
  { civilianWord: 'Bee', imposterWord: 'Wasp', category: 'Insects', mainCategory: 'Animals', difficulty: 'Hard', hint: 'A small flying insect with a stinger essential to flowers.' },
  { civilianWord: 'Butterfly', imposterWord: 'Moth', category: 'Insects', mainCategory: 'Animals', difficulty: 'Hard', hint: 'A winged insect that undergoes metamorphosis from a caterpillar.' },
  { civilianWord: 'Wolf', imposterWord: 'Fox', category: 'Canines', mainCategory: 'Animals', difficulty: 'Medium', hint: 'A wild canine known for intelligence, fur, and hunting in nature.' },
  { civilianWord: 'Cheetah', imposterWord: 'Leopard', category: 'Wild Cats', mainCategory: 'Animals', difficulty: 'Hard', hint: 'A spotted wild African cat built for speed and agility.' },
  { civilianWord: 'Owl', imposterWord: 'Hawk', category: 'Birds', mainCategory: 'Animals', difficulty: 'Medium', hint: 'A nocturnal or sharp-eyed predatory bird with feathers.' },

  // Countries & World
  { civilianWord: 'USA', imposterWord: 'Canada', category: 'Countries', mainCategory: 'Countries', difficulty: 'Easy', hint: 'A major North American country with diverse landscapes.' },
  { civilianWord: 'India', imposterWord: 'Pakistan', category: 'Countries', mainCategory: 'Countries', difficulty: 'Easy', hint: 'A South Asian nation rich in history and culture.' },
  { civilianWord: 'Japan', imposterWord: 'China', category: 'Countries', mainCategory: 'Countries', difficulty: 'Easy', hint: 'An East Asian nation known for rich heritage and modern cities.' },
  { civilianWord: 'Brazil', imposterWord: 'Argentina', category: 'Countries', mainCategory: 'Countries', difficulty: 'Easy', hint: 'A prominent South American country known for football and culture.' },
  { civilianWord: 'France', imposterWord: 'Germany', category: 'Countries', mainCategory: 'Countries', difficulty: 'Medium', hint: 'A European nation famous for culture, landmarks, and cuisine.' },
  { civilianWord: 'Italy', imposterWord: 'Spain', category: 'Countries', mainCategory: 'Countries', difficulty: 'Medium', hint: 'A Southern European nation renowned for art, history, and food.' },
  { civilianWord: 'Australia', imposterWord: 'New Zealand', category: 'Countries', mainCategory: 'Countries', difficulty: 'Medium', hint: 'An island nation in Oceania known for wildlife and natural beauty.' },
  { civilianWord: 'Sweden', imposterWord: 'Norway', category: 'Countries', mainCategory: 'Countries', difficulty: 'Hard', hint: 'A Scandinavian nation in Northern Europe.' },

  // Technology & Gadgets
  { civilianWord: 'Laptop', imposterWord: 'Computer', category: 'Computing', mainCategory: 'Technology', difficulty: 'Easy', hint: 'An electronic device used for working, gaming, and surfing the internet.' },
  { civilianWord: 'Smartphone', imposterWord: 'Tablet', category: 'Mobile Devices', mainCategory: 'Technology', difficulty: 'Easy', hint: 'A portable touchscreen gadget used for communication and apps.' },
  { civilianWord: 'Headphones', imposterWord: 'Earbuds', category: 'Audio', mainCategory: 'Technology', difficulty: 'Easy', hint: 'An audio device worn on or in ears to listen to music privately.' },
  { civilianWord: 'Television', imposterWord: 'Projector', category: 'Displays', mainCategory: 'Technology', difficulty: 'Medium', hint: 'A screen display device used to watch movies and broadcast shows.' },
  { civilianWord: 'Camera', imposterWord: 'Camcorder', category: 'Media Equipment', mainCategory: 'Technology', difficulty: 'Medium', hint: 'An optical device used to capture photos or record video clips.' },
  { civilianWord: 'Keyboard', imposterWord: 'Typewriter', category: 'Input Devices', mainCategory: 'Technology', difficulty: 'Hard', hint: 'A set of letter keys used to type text into documents or screens.' },
  { civilianWord: 'Smartwatch', imposterWord: 'Fitness Band', category: 'Wearables', mainCategory: 'Technology', difficulty: 'Hard', hint: 'A wrist gadget that tracks time, health, and notifications.' },
  { civilianWord: 'Drone', imposterWord: 'Helicopter', category: 'Aircraft', mainCategory: 'Technology', difficulty: 'Medium', hint: 'A flying machine equipped with rotating blades.' },

  // Cricket
  { civilianWord: 'Cricket', imposterWord: 'Baseball', category: 'Cricket', mainCategory: 'Cricket', difficulty: 'Easy', hint: 'A bat-and-ball team sport immensely popular globally.' },
  { civilianWord: 'Batsman', imposterWord: 'Bowler', category: 'Cricket', mainCategory: 'Cricket', difficulty: 'Easy', hint: 'A key player role on a cricket field.' },
  { civilianWord: 'Boundary (Four)', imposterWord: 'Sixer', category: 'Cricket', mainCategory: 'Cricket', difficulty: 'Easy', hint: 'A high-scoring shot hit by a batsman.' },
  { civilianWord: 'Wicket', imposterWord: 'Stump', category: 'Cricket', mainCategory: 'Cricket', difficulty: 'Medium', hint: 'A target equipment behind the batsman.' },
  { civilianWord: 'Spin Bowling', imposterWord: 'Fast Bowling', category: 'Cricket', mainCategory: 'Cricket', difficulty: 'Hard', hint: 'A specialized delivery style used by cricket bowlers.' },

  // Football
  { civilianWord: 'Football', imposterWord: 'Rugby', category: 'Football', mainCategory: 'Football', difficulty: 'Easy', hint: 'The world\'s most popular sport played with a spherical ball.' },
  { civilianWord: 'Real Madrid', imposterWord: 'Barcelona', category: 'Football', mainCategory: 'Football', difficulty: 'Easy', hint: 'A legendary European football club.' },
  { civilianWord: 'Penalty Kick', imposterWord: 'Free Kick', category: 'Football', mainCategory: 'Football', difficulty: 'Medium', hint: 'A set piece opportunity awarded by the referee in football.' },
  { civilianWord: 'World Cup', imposterWord: 'Champions League', category: 'Football', mainCategory: 'Football', difficulty: 'Medium', hint: 'A prestigious football tournament watched worldwide.' },
  { civilianWord: 'Goalkeeper', imposterWord: 'Defender', category: 'Football', mainCategory: 'Football', difficulty: 'Hard', hint: 'A key defensive position on a football pitch.' },

  // Places & Environment
  { civilianWord: 'Beach', imposterWord: 'Desert', category: 'Landscapes', mainCategory: 'Places', difficulty: 'Easy', hint: 'A vast natural landscape dominated by sand and open horizons.' },
  { civilianWord: 'Mountain', imposterWord: 'Hill', category: 'Topography', mainCategory: 'Places', difficulty: 'Easy', hint: 'An elevated landform rising above the surrounding landscape.' },
  { civilianWord: 'Hospital', imposterWord: 'Pharmacy', category: 'Healthcare Facilities', mainCategory: 'Places', difficulty: 'Medium', hint: 'A place where people go to receive medical care or treatment.' },
  { civilianWord: 'Airport', imposterWord: 'Railway Station', category: 'Transit Hubs', mainCategory: 'Places', difficulty: 'Easy', hint: 'A bustling transport hub for long-distance travelers and vehicles.' },
  { civilianWord: 'Cinema', imposterWord: 'Theater', category: 'Entertainment Venues', mainCategory: 'Places', difficulty: 'Medium', hint: 'A place where audiences gather to watch live or projected shows.' },
  { civilianWord: 'Museum', imposterWord: 'Art Gallery', category: 'Cultural Venues', mainCategory: 'Places', difficulty: 'Medium', hint: 'A building preserving valuable historical artifacts or artwork.' },
  { civilianWord: 'Hotel', imposterWord: 'Resort', category: 'Accommodation', mainCategory: 'Places', difficulty: 'Medium', hint: 'A commercial establishment providing lodging to travelers.' },
  { civilianWord: 'Castle', imposterWord: 'Palace', category: 'Historic Buildings', mainCategory: 'Places', difficulty: 'Hard', hint: 'A grand historical stone residence built for royalty or defense.' },
  { civilianWord: 'Forest', imposterWord: 'Jungle', category: 'Ecosystems', mainCategory: 'Places', difficulty: 'Easy', hint: 'A dense green area covered with trees, plants, and wildlife.' }
];

let usedIndices: Set<number> = new Set();

export function getRandomWordPair(): ExtendedWordPair {
  return getFilteredWordPair('Random', 'Medium');
}

export function getFilteredWordPair(
  category: string = 'Random',
  difficulty: 'Easy' | 'Medium' | 'Hard' | string = 'Medium'
): ExtendedWordPair {
  let pool = WORD_DICTIONARY;

  // Filter by category
  if (category && category !== 'Random') {
    const catLower = category.toLowerCase();
    const categoryMatches = pool.filter(
      (item) =>
        (item.mainCategory && item.mainCategory.toLowerCase() === catLower) ||
        item.category.toLowerCase().includes(catLower)
    );
    if (categoryMatches.length > 0) {
      pool = categoryMatches;
    }
  }

  // Filter by difficulty
  if (difficulty) {
    const diffLower = difficulty.toLowerCase();
    const diffMatches = pool.filter((item) => item.difficulty?.toLowerCase() === diffLower);
    if (diffMatches.length > 0) {
      pool = diffMatches;
    }
  }

  // Fall back to pool or entire dictionary if pool empty
  if (pool.length === 0) {
    pool = WORD_DICTIONARY;
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  const pair = pool[randomIndex];
  const swap = Math.random() > 0.5;

  return {
    ...pair,
    civilianWord: swap ? pair.imposterWord : pair.civilianWord,
    imposterWord: swap ? pair.civilianWord : pair.imposterWord,
    category: pair.mainCategory || pair.category,
    hint: pair.hint,
  };
}
