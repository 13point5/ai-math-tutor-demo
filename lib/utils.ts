import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to generate color-based class names
export function getColorClasses(color: string) {
  if (color === "blue") {
    return {
      avatarBg: "bg-blue-200",
      nameText: "text-blue-700",
      boxBorder: "border-blue-400 border-4",
      boxBg: "bg-blue-200",
    };
  } else if (color === "pink") {
    return {
      avatarBg: "bg-pink-200",
      nameText: "text-pink-700",
      boxBorder: "border-pink-400 border-4",
      boxBg: "bg-pink-200",
    };
  }

  return {
    avatarBg: `bg-${color}-200`,
    nameText: `text-${color}-700`,
    boxBorder: `border-${color}-400 border-4`,
    boxBg: `bg-${color}-200`,
  };
}
