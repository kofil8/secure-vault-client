"use client";

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

export default function ProfileComponent() {
    // Mock user data — replace this with real user data from your auth system
    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "https://i.pravatar.cc/150?img=1", // Random avatar
        bio: "Full-stack developer passionate about building beautiful UIs.",
        joinedDate: "January 2023",
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-white p-6">
            <Card className="w-full max-w-md border border-black/10 bg-white shadow-xl">
                <CardHeader className="flex flex-col items-center text-center space-y-4">
                    <div className="flex flex-col items-center">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </div>

                    <div>
                        <CardTitle className="text-2xl font-bold tracking-tight text-black">
                            {user.name}
                        </CardTitle>
                        <CardDescription className="text-black/70">{user.email}</CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <Separator className="bg-black/10" />

                    <div>
                        <p className="text-sm font-medium text-black/80">Bio</p>
                        <p className="text-sm text-black/60 mt-1">{user.bio}</p>
                    </div>

                    <Separator className="bg-black/10" />

                    <div>
                        <p className="text-sm font-medium text-black/80">Joined</p>
                        <p className="text-sm text-black/60 mt-1">{user.joinedDate}</p>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3 pt-6">
                    <Button className="w-full bg-black text-white hover:bg-black/90">
                        <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}