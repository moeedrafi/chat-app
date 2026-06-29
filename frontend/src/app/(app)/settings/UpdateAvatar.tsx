"use client";
import { useState } from "react";
import { CircleCheck } from "lucide-react";

const avatars = [
  "red",
  "blue",
  "green",
  "yellow",
  "violet",
  "indigo",
  "orange",
];

type AvatarColor = (typeof avatars)[number];

const avatarColors: Record<AvatarColor, string> = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  violet: "bg-violet-500",
  indigo: "bg-indigo-500",
  orange: "bg-orange-500",
};

export const UpdateAvatar = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarColor>("blue");

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold tracking-tight">
        Update Avatar Icon
      </h2>

      <div className="flex items-center gap-3">
        {avatars.map((avatar) => (
          <button
            key={avatar}
            type="button"
            onClick={
              () => setSelectedAvatar(avatar as keyof typeof avatarColors)
              // TODO: PATCH users/me
            }
            className={`flex items-center justify-center w-12 h-12 rounded-full shrink-0 cursor-pointer ${
              avatarColors[avatar as keyof typeof avatarColors]
            }`}
          >
            {selectedAvatar === avatar && (
              <CircleCheck className="text-white" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
