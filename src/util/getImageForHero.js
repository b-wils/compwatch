export const getImageForHero = (hero) => {
  return process.env.PUBLIC_URL + "/images/heroes/Icon-" + hero.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, "_") + ".png";
}