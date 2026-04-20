import { RequestList } from "./RequestList";
import { RequestSearch } from "./RequestSearch";

export default function RequestsPage() {
  return (
    <div className="flex-1 h-full px-4 py-6 font-lato text-2xl text-text">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Requests</h1>

        <RequestSearch />
        <RequestList />
      </div>
    </div>
  );
}
