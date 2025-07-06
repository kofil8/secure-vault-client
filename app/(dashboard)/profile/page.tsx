"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Pencil } from "lucide-react";
import { getProfile } from "@/app/actions/get-profile";
import { logoutUser } from "@/app/actions/logout-user";
import { updateProfileAction } from "@/app/actions/update-profile";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export default function ProfileComponent() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    profileImage: "",
    bio: "",
    phoneNumber: "",
  });

  const [form, setForm] = useState({
    name: "",
    bio: "",
    phoneNumber: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getProfile();
      if (profile) {
        setUser(profile);
        setForm({
          name: profile.name || "",
          bio: profile.bio || "",
          phoneNumber: profile.phoneNumber || "",
        });
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result?.redirectToLogin) {
      router.push("/login");
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("bodyData", JSON.stringify(form));
    if (image) formData.append("image", image);

    const result = await updateProfileAction(formData);

    if (result.success) {
      setEditMode(false);
      window.location.reload(); // Or re-fetch user state if preferred
    } else {
      alert(result.message);
    }

    setLoading(false);
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-white p-6'>
      <Card className='w-full max-w-md border border-black/10 bg-white shadow-xl'>
        <CardHeader className='flex flex-col items-center text-center space-y-4'>
          <Avatar className='h-20 w-20'>
            <AvatarImage src={user.profileImage} alt={user.name} />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>

          {editMode && (
            <Input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='mt-2 w-full'
            />
          )}

          <div>
            <CardTitle className='text-2xl font-bold tracking-tight text-black'>
              {editMode ? (
                <Input
                  name='name'
                  value={form.name}
                  onChange={handleFormChange}
                  className='mt-2'
                />
              ) : (
                user.name
              )}
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
            {editMode ? (
              <Textarea
                name='bio'
                value={form.bio}
                onChange={handleFormChange}
                className='mt-1'
              />
            ) : (
              <p className='text-sm text-black/60 mt-1'>{user.bio}</p>
            )}
          </div>

          <Separator className='bg-black/10' />

          <div>
            <p className='text-sm font-medium text-black/80'>Phone Number</p>
            {editMode ? (
              <Input
                name='phoneNumber'
                value={form.phoneNumber}
                onChange={handleFormChange}
                className='mt-1'
              />
            ) : (
              <p className='text-sm text-black/60 mt-1'>{user.phoneNumber}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className='flex flex-col gap-3 pt-6'>
          {editMode ? (
            <>
              <Button
                className='w-full bg-black text-white hover:bg-black/90'
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Updating..." : "Save Changes"}
              </Button>
              <Button
                variant='outline'
                className='w-full'
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant='outline'
                className='w-full flex items-center justify-center gap-2'
                onClick={() => setEditMode(true)}
              >
                <Pencil className='h-4 w-4' /> Edit Profile
              </Button>
              <Button
                className='w-full bg-black text-white hover:bg-black/90'
                onClick={handleLogout}
              >
                <LogOut className='mr-2 h-4 w-4' /> Sign Out
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
