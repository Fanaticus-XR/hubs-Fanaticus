import { fetchReticulumAuthenticated } from "./phoenix-utils";
import defaultAvatar from "../assets/models/DefaultAvatar.glb";

const names = [
  "Nova Blaze",
  "Galaxia Stellar",
  "Astro Jones",
  "Solaris Moon",
  "Cosmic Cruiser",
  "Star Commander",
  "Nebula Nightingale",
  "Jupiter Jump",
  "Andromeda Ash",
  "Polaris Prime",
  "Vega Voyager",
  "Orion",
  "Nebula",
  "Solar",
  "Astro",
  "Cosmic",
  "Vega",
  "Sirius",
  "Polaris",
  "Solaris",
  "Eclipse"
];

function chooseRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateRandomName() {
  return `${chooseRandom(names)}`;
}

export async function fetchRandomDefaultAvatarId() {
  const defaultAvatarEndpoint = "/api/v1/media/search?filter=default&source=avatar_listings";
  const defaultAvatars = (await fetchReticulumAuthenticated(defaultAvatarEndpoint)).entries || [];
  if (defaultAvatars.length === 0) {
    // If reticulum doesn't return any default avatars, just default to the duck model. This should only happen
    // when running against a fresh reticulum server, e.g. a local ret instance.
    return new URL(defaultAvatar, location.href).href;
  }
  const avatarIds = defaultAvatars.map(avatar => avatar.id);
  return chooseRandom(avatarIds);
}
