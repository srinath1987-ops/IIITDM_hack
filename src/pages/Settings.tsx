
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun, User, Settings as SettingsIcon } from 'lucide-react';
import ProfileSection from '@/components/profile/ProfileSection';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <MainLayout>
      <div className="pt-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold dark:text-white">Settings</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="dark:bg-gray-800 border dark:border-gray-700">
            <TabsTrigger value="profile" className="flex gap-2 items-center dark:data-[state=active]:bg-gray-700">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex gap-2 items-center dark:data-[state=active]:bg-gray-700">
              <SettingsIcon className="h-4 w-4" />
              <span>Preferences</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileSection />
          </TabsContent>

          <TabsContent value="preferences">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl dark:text-white">Appearance</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Customize the appearance of the application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-2">
                  <div className="flex flex-col space-y-1">
                    <Label className="text-sm font-medium dark:text-white" htmlFor="theme-mode">
                      Dark Mode
                    </Label>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Toggle between light and dark themes
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <Switch 
                      id="theme-mode" 
                      checked={theme === 'dark'}
                      onCheckedChange={() => toggleTheme()}
                    />
                    <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
