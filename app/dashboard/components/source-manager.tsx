"use client";

import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

const Settings = [
  {
    name: "Comment",
    href: "/dashboard/comments",
  },
  {
    name: "Friend",
    href: "/dashboard/friends",
  },
];

export const SourceManager = () => {
  const router = useRouter();
  return (
    <div className="space-y-8">
      <h2 className="font-medium text-xl">Database Source Manager</h2>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
        {Settings.map((setting) => (
          <div
            key={setting.name}
            className="flex items-center justify-between rounded-md border p-4"
          >
            <span>{setting.name}</span>
            <span
              className="hover:cursor-pointer"
              onClick={() => router.push(setting.href)}
            >
              <ExternalLink />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
