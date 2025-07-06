"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { LogOut } from "lucide-react";
import { getProfile } from "@/app/actions/get-profile";
import { logoutUser } from "@/app/actions/logout-user";
import { useRouter } from "next/navigation"; // Import useRouter to handle client-side navigation

export default function ProfileComponent() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "",
    bio: "",
    phoneNumber: "",
  });

  const router = useRouter(); // Initialize useRouter for redirection

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile(); // Fetch data using the server-side function
        if (profileData) {
          setUser(profileData); // Set the state with the fetched profile data
        } else {
          console.error("Profile not found or user is not authenticated");
        }
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };

    fetchProfile();
  }, []);

  // Handle logout and redirect to login page
  const handleLogout = async () => {
    try {
      const result = await logoutUser(); // Call the server-side logout function

      if (result?.redirectToLogin) {
        // If logout is successful, redirect to the login page
        router.push("/login"); // Use router.push for client-side redirection
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-white p-6'>
      <Card className='w-full max-w-md border border-black/10 bg-white shadow-xl'>
        <CardHeader className='flex flex-col items-center text-center space-y-4'>
          <div className='flex flex-col items-center'>
            <Avatar className='h-20 w-20'>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>

          <div>
            <CardTitle className='text-2xl font-bold tracking-tight text-black'>
              {user.name}
            </CardTitle>
            <CardDescription className='text-black/70'>
              {user.email}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className='space-y-4'>
          <Separator className='bg-black/10' />

          <div>
            <p className='text-sm font-medium text-black/80'>Bio</p>
            <p className='text-sm text-black/60 mt-1'>{user.bio}</p>
          </div>

          <Separator className='bg-black/10' />

          <div>
            <p className='text-sm font-medium text-black/80'>Phone Number</p>
            <p className='text-sm text-black/60 mt-1'>{user.phoneNumber}</p>
          </div>
        </CardContent>

        <CardFooter className='flex flex-col gap-3 pt-6'>
          <Button
            className='w-full bg-black text-white hover:bg-black/90'
            onClick={handleLogout}
          >
            <LogOut className='mr-2 h-4 w-4' /> Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
