"use client";

import { Button } from "@/components/ui/Button";

export const Modal = ({
  username,
  onClose,
}: {
  username: string;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-2">
      <div className="w-full max-w-sm rounded-xl bg-bg p-4 shadow-xl">
        <h3 className="text-lg font-semibold">Remove Friend</h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Are you sure you want to remove{" "}
          <span className="font-medium text-text">{username}</span> from your
          friends list?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={() => {
              // TODO: Call unfriend API
              onClose();
            }}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};
