"use client";

import { Role } from "@/lib/types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header: React.FC<{
  userData: {
    username: string;
    email: string;
    emailMD5: string;
    role: Role;
    avatarUrl: string;
  };
}> = ({ userData }) => {
  return (
    <header className="flex h-20 w-full items-center justify-between bg-white px-6 shadow">
      <div className="font-medium text-xl">Dashboard</div>
      <Avatar className="h-12 w-12 border shadow">
        <AvatarImage
          src={
            userData.avatarUrl ||
            `https://cravatar.cn/avatar/${userData.emailMD5}`
          }
        />
        <AvatarFallback>{userData.username.slice(0, 1)}</AvatarFallback>
      </Avatar>
    </header>
  );
};

export default Header;
