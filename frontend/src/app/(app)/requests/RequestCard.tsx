import { Button } from "@/components/ui/Button";
import type { PendingRequest } from "@/types/friends";

interface RequestCardProps {
  request: PendingRequest;
  onAccept: () => void;
  onDecline: () => void;
}

export const RequestCard = ({
  onAccept,
  onDecline,
  request,
}: RequestCardProps) => {
  return (
    <div className="bg-light px-5 py-4 flex flex-col justify-between gap-4 rounded-xl border border-color">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-dark" />

        <div className="flex flex-col min-w-0">
          <span className="font-medium text-sm truncate">
            {request.sender.username}
          </span>
          <span className="text-xs text-muted">Wants to connect</span>
        </div>
      </div>

      <div className="flex gap-2 text-sm">
        <Button onClick={onAccept}>Accept</Button>

        <Button
          onClick={onDecline}
          variant="destructive"
          className="text-muted hover:text-text"
        >
          Decline
        </Button>
      </div>
    </div>
  );
};
