"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Pencil } from "lucide-react";
import { getProfile } from "@/app/actions/get-profile";
import { logoutUser } from "@/app/actions/logout-user";
import { updateProfileAction } from "@/app/actions/update-profile";
import {
  fetchSecurityStatus,
  updateSecurityAnswers,
} from "@/app/actions/security";
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
import { SidebarTrigger } from "@/components/ui/sidebar";
import SecurityModal from "./components/SecurityModal";
import { toast } from "sonner";

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
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [securityQuestions, setSecurityQuestions] = useState<string[]>([
    "",
    "",
    "",
  ]);
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

    const loadSecurityStatus = async () => {
      const res = await fetchSecurityStatus();
      console.log("Fetched security status:", res);
      if (res.success) {
        setSecurityQuestions(res.data.questions || ["", "", ""]);
      } else {
        toast.error(res.message);
      }
    };

    fetchProfile();
    loadSecurityStatus();
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
      window.location.reload();
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  const handleSecuritySave = async (questions: string[], answers: string[]) => {
    const result = await updateSecurityAnswers(questions, answers);
    if (result.success) {
      setSecurityQuestions(questions);
      toast.success("Security questions updated successfully!");
      setShowSecurityModal(false);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className='relative min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6 md:py-10'>
      <div className='absolute top-4 left-4 z-50 md:static md:mb-4'>
        <SidebarTrigger />
      </div>

      <div className='flex items-center justify-center'>
        <Card className='w-full max-w-md rounded-2xl border border-black/10 bg-white dark:bg-gray-800 shadow-2xl transition-all'>
          <CardHeader className='flex flex-col items-center text-center space-y-4'>
            <Avatar className='h-20 w-20 shadow'>
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
              <CardTitle className='text-2xl font-bold tracking-tight text-black dark:text-white'>
                {editMode ? (
                  <Input
                    name='name'
                    value={form.name}
                    onChange={handleFormChange}
                    className='mt-2'
                    placeholder='Your Name'
                  />
                ) : (
                  user.name
                )}
              </CardTitle>
              <CardDescription className='text-black/70 dark:text-gray-300'>
                {user.email}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className='space-y-5'>
            <Separator className='bg-black/10 dark:bg-white/10' />

            <div>
              <p className='text-sm font-semibold text-black/80 dark:text-white'>
                Bio
              </p>
              {editMode ? (
                <Textarea
                  name='bio'
                  value={form.bio}
                  onChange={handleFormChange}
                  placeholder='Write a short bio...'
                  className='mt-1'
                />
              ) : (
                <p className='text-sm text-black/60 dark:text-gray-300 mt-1'>
                  {user.bio}
                </p>
              )}
            </div>

            <div>
              <p className='text-sm font-semibold text-black/80 dark:text-white'>
                Phone Number
              </p>
              {editMode ? (
                <Input
                  name='phoneNumber'
                  value={form.phoneNumber}
                  onChange={handleFormChange}
                  placeholder='Phone Number'
                  className='mt-1'
                />
              ) : (
                <p className='text-sm text-black/60 dark:text-gray-300 mt-1'>
                  {user.phoneNumber}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className='flex flex-col gap-3 pt-6'>
            {editMode ? (
              <>
                <Button
                  className='w-full bg-black text-white hover:bg-black/90 transition'
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
                  variant='outline'
                  className='w-full'
                  onClick={() => setShowSecurityModal(true)}
                >
                  Security Questions
                </Button>
                <Button
                  className='w-full bg-black text-white hover:bg-black/90 transition'
                  onClick={handleLogout}
                >
                  <LogOut className='mr-2 h-4 w-4' /> Sign Out
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>

      <SecurityModal
        isOpen={showSecurityModal}
        setIsOpen={setShowSecurityModal}
        initialQuestions={securityQuestions}
        onSave={handleSecuritySave}
      />
    </div>
  );
}
