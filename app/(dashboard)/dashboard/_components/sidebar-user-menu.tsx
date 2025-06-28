/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useTransition } from "react";
import { logoutUser } from "@/app/actions/logout-user";
import { getProfile } from "@/app/actions/get-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, User } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SidebarUserMenu() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(
    null
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const result = await getProfile();
      if (result) setUser(result);
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await logoutUser(); // Now returns { success: true }
        toast.success("Logged out successfully");
        router.push("/login"); // Redirect on client side
      } catch (err: any) {
        toast.error(err.message || "Logout failed");
      }
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage src='/placeholder.svg' alt='User' />
                <AvatarFallback className='rounded-lg'>
                  {user?.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {user?.name || "Loading..."}
                </span>
                <span className='truncate text-xs'>{user?.email || ""}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side='bottom'
            align='end'
            sideOffset={4}
          >
            <DropdownMenuItem asChild>
              <a href='/profile'>
                <User className='mr-2 h-4 w-4' /> Profile
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href='/change-password'>
                <Settings className='mr-2 h-4 w-4' /> Change Password
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              {isPending ? "Logging out..." : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
