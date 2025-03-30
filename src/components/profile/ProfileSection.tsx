
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Camera } from 'lucide-react';

// Define the form schema
const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  vehicle_reg: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileSection = () => {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Initialize the form with react-hook-form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      vehicle_reg: 'TN 07 CG 1234',
    },
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Get user profile
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          form.reset({
            name: data.name || '',
            phone: data.phone || '',
            vehicle_reg: 'TN 07 CG 1234', // Default value if not in database
          });
        }

        // Get avatar image
        await fetchAvatar();
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to load profile data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Fetch user avatar
  const fetchAvatar = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .storage
        .from('avatars')
        .list(user.id, {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (data && data.length > 0) {
        const { data: url } = supabase
          .storage
          .from('avatars')
          .getPublicUrl(`${user.id}/${data[0].name}`);

        setAvatarUrl(url.publicUrl);
      }
    } catch (error) {
      console.error('Error fetching avatar:', error);
    }
  };

  // Handle file upload
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;
    if (!user) return;

    const file = event.target.files[0];
    const fileSize = file.size / 1024 / 1024; // in MB
    
    if (fileSize > 2) {
      toast({
        title: 'Error',
        description: 'File size should not exceed 2MB',
        variant: 'destructive',
      });
      return;
    }

    // Only accept image files
    if (!file.type.match('image.*')) {
      toast({
        title: 'Error',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    setUploadingImage(true);
    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(data.publicUrl);
      toast({
        title: 'Success',
        description: 'Profile picture updated',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle form submission
  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    setLoading(true);

    try {
      // Update or insert user profile
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          name: values.name,
          phone: values.phone,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    const name = form.watch('name');
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user && user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <Card className="w-full dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl dark:text-white">Profile Information</CardTitle>
        <CardDescription className="dark:text-gray-400">
          Update your personal and vehicle details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-gray-200 dark:border-gray-700">
                <AvatarImage src={avatarUrl || undefined} alt="Profile" />
                <AvatarFallback className="text-xl">{getUserInitials()}</AvatarFallback>
              </Avatar>
              
              {uploadingImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
              
              <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-logistics-600 hover:bg-logistics-700 flex items-center justify-center cursor-pointer text-white">
                <Camera className="h-4 w-4" />
                <input 
                  id="avatar-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={uploadingImage}
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click the camera icon to upload a profile picture
            </p>
          </div>
          
          <div className="flex-1">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-gray-300">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="dark:text-red-400" />
                    </FormItem>
                  )}
                />
                
                {user && (
                  <FormItem>
                    <FormLabel className="dark:text-gray-300">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        value={user.email || ''}
                        disabled
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white opacity-70"
                      />
                    </FormControl>
                    <FormDescription className="dark:text-gray-500">
                      Your email address cannot be changed
                    </FormDescription>
                  </FormItem>
                )}
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-gray-300">Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your phone number"
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="dark:text-red-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="vehicle_reg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-gray-300">Vehicle Registration</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your vehicle registration"
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="dark:text-red-400" />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="mt-4 dark:bg-logistics-600 dark:hover:bg-logistics-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
