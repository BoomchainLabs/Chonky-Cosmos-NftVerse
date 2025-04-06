const axeImage =
  "https://metadata.sequence.app/projects/30957/collections/690/tokens/0/image.png";
const alternativeAxeImage =
  "https://metadata.sequence.app/projects/30957/collections/690/tokens/1/image.png";
const chestImage =
  "https://res.cloudinary.com/richardiral/image/upload/v1727980612/chestimage.png";

export function mergeAttributes(attributes) {
  if (attributes.length === 0) return null;
  return attributes.reduce((acc, attribute) => {
    return { ...acc, ...attribute };
  }, {});
}

export function generateDivineAxeName() {
  const suffix = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `Divine Axe #${suffix}`;
}

export function generateAxeDescription() {
  const adjectives = [
    "mighty",
    "ancient",
    "powerful",
    "enchanted",
    "cursed",
    "legendary",
    "forgotten",
  ];
  const origins = [
    "forged in the fires of a dying star",
    "blessed by ancient gods",
    "crafted by the hands of giants",
    "lost in the void of time",
    "imbued with the souls of fallen warriors",
  ];
  const powers = [
    "capable of shattering mountains",
    "that cleaves through space and time",
    "which never dulls",
    "with the power to summon storms",
    "that grows stronger with every battle",
  ];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const origin = origins[Math.floor(Math.random() * origins.length)];
  const power = powers[Math.floor(Math.random() * powers.length)];

  return `This ${adjective} axe, ${origin}, ${power}.`;
}

export function generateAxeAttributes(length) {
  const possibleAttributes = [
    "sharpness",
    "weight",
    "balance",
    "durability",
    "magic",
    "attackPower",
    "elementalAffinity",
    "edgeRetention",
    "speed",
    "criticalHitChance",
  ];

  if (length > possibleAttributes.length)
    throw new Error("Requested attributes exceed available options");

  const attributes = [];
  const availableAttributes = [...possibleAttributes];

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * availableAttributes.length);
    const randomAttribute = availableAttributes.splice(randomIndex, 1)[0];
    const randomValue = Math.floor(Math.random() * 1500) + 1;
    const attribute = {};
    attribute[randomAttribute] = randomValue;
    attributes.push(attribute);
  }

  return attributes;
}

export function getRandomImage() {
  const images = [axeImage, alternativeAxeImage];
  return images[Math.floor(Math.random() * images.length)];
}

export function generateNFTsMetadata(count) {
  const metadatas = Array.from({ length: count }, () => ({
    name: generateDivineAxeName(),
    description: generateAxeDescription(),
    image: getRandomImage(),
    attributes: generateAxeAttributes(4),
  }));

  return metadatas;
}

export function generatePlaceholderMetadata(count) {
  const metadatas = Array.from({ length: count }, () => ({
    name: "Chest",
    description: "Placeholder NFT",
    image: chestImage,
    attributes: [],
  }));

  return metadatas;
}
