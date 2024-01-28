import { ExternalLink } from "lucide-react";

export default async function Page() {
  return (
    <div className="space-y-8 pt-8">
      <h2 className="font-medium text-xl">Database Source Manager</h2>
      <div className="grid grid-cols-3 gap-6">
        <div className="flex items-center justify-between rounded-md border p-4">
          <span>Comment</span>
          <ExternalLink />
        </div>
        <div className="flex items-center justify-between rounded-md border p-4">
          <span>Friends</span>
          <ExternalLink />
        </div>
      </div>
    </div>
  );
}
