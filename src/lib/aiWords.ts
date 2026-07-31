import { WordPair } from './types';

export interface ExtendedWordPair extends WordPair {
  hint: string;
}

export const WORD_DICTIONARY: ExtendedWordPair[] = [
  // Food & Drinks
  { civilianWord: 'Apple', imposterWord: 'Mango', category: 'Fruits', hint: 'A sweet, juicy orchard fruit often enjoyed fresh or as juice.' },
  { civilianWord: 'Coffee', imposterWord: 'Tea', category: 'Beverages', hint: 'A popular hot caffeinated drink brewed around the world.' },
  { civilianWord: 'Pizza', imposterWord: 'Burger', category: 'Fast Food', hint: 'A classic savory fast-food favorite made with dough and toppings.' },
  { civilianWord: 'Pancake', imposterWord: 'Waffle', category: 'Breakfast', hint: 'A golden-brown cooked batter treat served with syrup.' },
  { civilianWord: 'Chocolate', imposterWord: 'Ice Cream', category: 'Desserts', hint: 'A sweet indulgence loved by children and adults alike.' },
  { civilianWord: 'Sushi', imposterWord: 'Ramen', category: 'Asian Cuisine', hint: 'A famous Japanese dish made with fresh ingredients and rice or broth.' },
  { civilianWord: 'Cake', imposterWord: 'Cupcake', category: 'Bakery', hint: 'A frosted sweet baked dessert sliced for celebrations.' },
  { civilianWord: 'Lemon', imposterWord: 'Lime', category: 'Citrus Fruits', hint: 'A sour citrus fruit with high vitamin C used in cooking and drinks.' },
  { civilianWord: 'Donut', imposterWord: 'Bagel', category: 'Bakery', hint: 'A ring-shaped baked or fried dough item eaten for breakfast or snacks.' },
  { civilianWord: 'Popcorn', imposterWord: 'Potato Chips', category: 'Snacks', hint: 'A crunchy salty snack popular at movie theaters and parties.' },
  { civilianWord: 'Milk', imposterWord: 'Smoothie', category: 'Beverages', hint: 'A creamy liquid drink packed with nutrients.' },
  { civilianWord: 'Pasta', imposterWord: 'Noodles', category: 'Carbs', hint: 'A staple staple wheat food served with sauce or seasoning.' },
  { civilianWord: 'Taco', imposterWord: 'Burrito', category: 'Mexican Food', hint: 'A tortilla wrapped around flavorful meats, beans, and salsa.' },
  { civilianWord: 'Butter', imposterWord: 'Cheese', category: 'Dairy', hint: 'A rich yellow dairy product made from milk or cream.' },

  // Animals & Nature
  { civilianWord: 'Lion', imposterWord: 'Tiger', category: 'Wild Cats', hint: 'A majestic predatory wild big cat known for its hunting prowess.' },
  { civilianWord: 'Dolphin', imposterWord: 'Whale', category: 'Marine Life', hint: 'An intelligent marine mammal swimming in ocean waters.' },
  { civilianWord: 'Falcon', imposterWord: 'Eagle', category: 'Birds of Prey', hint: 'A sharp-eyed bird of prey known for soaring high.' },
  { civilianWord: 'Crocodile', imposterWord: 'Alligator', category: 'Reptiles', hint: 'A large semi-aquatic predatory reptile with strong jaws.' },
  { civilianWord: 'Frog', imposterWord: 'Toad', category: 'Amphibians', hint: 'A small hopping amphibian found near water and wetlands.' },
  { civilianWord: 'Horse', imposterWord: 'Zebra', category: 'Mammals', hint: 'A four-legged hooved mammal known for running and riding.' },
  { civilianWord: 'Penguin', imposterWord: 'Puffin', category: 'Antarctic Birds', hint: 'A flightless coastal bird suited for swimming in cold waters.' },
  { civilianWord: 'Bee', imposterWord: 'Wasp', category: 'Insects', hint: 'A small flying insect with a stinger essential to flowers.' },
  { civilianWord: 'Butterfly', imposterWord: 'Moth', category: 'Insects', hint: 'A winged insect that undergoes metamorphosis from a caterpillar.' },
  { civilianWord: 'Wolf', imposterWord: 'Fox', category: 'Canines', hint: 'A wild canine known for intelligence, fur, and hunting in nature.' },
  { civilianWord: 'Cheetah', imposterWord: 'Leopard', category: 'Wild Cats', hint: 'A spotted wild African cat built for speed and agility.' },
  { civilianWord: 'Owl', imposterWord: 'Hawk', category: 'Birds', hint: 'A nocturnal or sharp-eyed predatory bird with feathers.' },

  // Places & Environments
  { civilianWord: 'Beach', imposterWord: 'Desert', category: 'Landscapes', hint: 'A vast natural landscape dominated by sand and open horizons.' },
  { civilianWord: 'Mountain', imposterWord: 'Hill', category: 'Topography', hint: 'An elevated landform rising above the surrounding landscape.' },
  { civilianWord: 'Hospital', imposterWord: 'Pharmacy', category: 'Healthcare Facilities', hint: 'A place where people go to receive medical care, treatment, or medicine.' },
  { civilianWord: 'Airport', imposterWord: 'Railway Station', category: 'Transit Hubs', hint: 'A bustling transport hub for long-distance travelers and vehicles.' },
  { civilianWord: 'Cinema', imposterWord: 'Theater', category: 'Entertainment Venues', hint: 'A place where audiences gather to watch live or projected shows.' },
  { civilianWord: 'Museum', imposterWord: 'Art Gallery', category: 'Cultural Venues', hint: 'A building preserving valuable historical artifacts or artwork.' },
  { civilianWord: 'Hotel', imposterWord: 'Resort', category: 'Accommodation', hint: 'A commercial establishment providing lodging and amenities to travelers.' },
  { civilianWord: 'Library', imposterWord: 'Bookstore', category: 'Reading Hubs', hint: 'A quiet place filled with shelves of books and reading materials.' },
  { civilianWord: 'Gym', imposterWord: 'Stadium', category: 'Sports Venues', hint: 'A facility equipped for athletic training, exercise, and sports.' },
  { civilianWord: 'Castle', imposterWord: 'Palace', category: 'Historic Buildings', hint: 'A grand historical stone residence built for royalty or defense.' },
  { civilianWord: 'Forest', imposterWord: 'Jungle', category: 'Ecosystems', hint: 'A dense green area covered with trees, plants, and wildlife.' },

  // Technology & Gadgets
  { civilianWord: 'Laptop', imposterWord: 'Computer', category: 'Computing', hint: 'An electronic device used for working, gaming, and surfing the internet.' },
  { civilianWord: 'Smartphone', imposterWord: 'Tablet', category: 'Mobile Devices', hint: 'A portable touchscreen gadget used for communication and apps.' },
  { civilianWord: 'Headphones', imposterWord: 'Earbuds', category: 'Audio', hint: 'An audio device worn on or in ears to listen to music privately.' },
  { civilianWord: 'Television', imposterWord: 'Projector', category: 'Displays', hint: 'A screen display device used to watch movies and broadcast shows.' },
  { civilianWord: 'Camera', imposterWord: 'Camcorder', category: 'Media Equipment', hint: 'An optical device used to capture photos or record video clips.' },
  { civilianWord: 'Keyboard', imposterWord: 'Typewriter', category: 'Input Devices', hint: 'A set of letter keys used to type text into documents or screens.' },
  { civilianWord: 'Smartwatch', imposterWord: 'Fitness Band', category: 'Wearables', hint: 'A wrist gadget that tracks time, health, and notifications.' },
  { civilianWord: 'Drone', imposterWord: 'Helicopter', category: 'Aircraft', hint: 'A flying machine equipped with rotating blades.' },

  // Sports & Games
  { civilianWord: 'Football', imposterWord: 'Cricket', category: 'Team Sports', hint: 'A popular global sport played on a field with a ball and teams.' },
  { civilianWord: 'Tennis', imposterWord: 'Badminton', category: 'Racket Sports', hint: 'A court game played with rackets, nets, and a fast projectile.' },
  { civilianWord: 'Basketball', imposterWord: 'Volleyball', category: 'Ball Sports', hint: 'A team sport where players score points using a high net or hoop.' },
  { civilianWord: 'Chess', imposterWord: 'Checkers', category: 'Board Games', hint: 'A strategic two-player board game played with checkered tiles.' },
  { civilianWord: 'Skateboard', imposterWord: 'Rollerblades', category: 'Urban Sports', hint: 'A wheeled equipment used for gliding and performing street tricks.' },
  { civilianWord: 'Guitar', imposterWord: 'Violin', category: 'Musical Instruments', hint: 'A wooden string instrument played by plucking or bowing.' },
  { civilianWord: 'Piano', imposterWord: 'Organ', category: 'Keyboards', hint: 'A large musical instrument played by pressing black and white keys.' },
  { civilianWord: 'Backpack', imposterWord: 'Suitcase', category: 'Luggage', hint: 'A portable bag used to carry personal items and clothes while traveling.' },
  { civilianWord: 'Sunglasses', imposterWord: 'Eyeglasses', category: 'Eyewear', hint: 'An accessory worn over the eyes for vision or sun protection.' },
  { civilianWord: 'Pen', imposterWord: 'Pencil', category: 'Stationery', hint: 'A writing tool used on paper to jot down notes and draw.' },
  { civilianWord: 'Umbrella', imposterWord: 'Raincoat', category: 'Weather Gear', hint: 'A protective item used to keep dry during rainy weather.' },
  { civilianWord: 'Sofa', imposterWord: 'Armchair', category: 'Furniture', hint: 'A comfortable cushioned seat item found in living rooms.' },
  { civilianWord: 'Mirror', imposterWord: 'Window', category: 'Household Glass', hint: 'A transparent or reflective glass pane built into walls or frames.' }
];

let usedIndices: Set<number> = new Set();

export function getRandomWordPair(): ExtendedWordPair {
  if (usedIndices.size >= WORD_DICTIONARY.length) {
    usedIndices.clear();
  }
  
  let randomIndex: number;
  do {
    randomIndex = Math.floor(Math.random() * WORD_DICTIONARY.length);
  } while (usedIndices.has(randomIndex));

  usedIndices.add(randomIndex);
  const pair = WORD_DICTIONARY[randomIndex];
  
  const swap = Math.random() > 0.5;
  return {
    civilianWord: swap ? pair.imposterWord : pair.civilianWord,
    imposterWord: swap ? pair.civilianWord : pair.imposterWord,
    category: pair.category,
    hint: pair.hint
  };
}
