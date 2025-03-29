
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = React.useState('Rajesh Kumar');
  const [email, setEmail] = React.useState('rajesh.k@example.com');
  const [phone, setPhone] = React.useState('9876543210');
  const [vehicleReg, setVehicleReg] = React.useState('TN 07 CG 1234');
  const [notifyTolls, setNotifyTolls] = React.useState(true);
  const [notifyWeather, setNotifyWeather] = React.useState(true);
  const [dataSharing, setDataSharing] = React.useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    toast({
      title: "Preferences updated",
      description: "Your notification preferences have been saved.",
    });
  };

  return (
    <MainLayout>
      <div className="pt-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold dark:text-white">Settings</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Manage your account and preferences
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Profile Information</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Update your personal and vehicle details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="dark:text-gray-300">Full Name</Label>
                    <Input 
                      id="name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="dark:text-gray-300">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="dark:text-gray-300">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vehicle-reg" className="dark:text-gray-300">Vehicle Registration</Label>
                    <Input 
                      id="vehicle-reg" 
                      value={vehicleReg}
                      onChange={(e) => setVehicleReg(e.target.value)}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                
                <Button type="submit" className="dark:bg-logistics-600 dark:text-white dark:hover:bg-logistics-700">Save Profile</Button>
              </form>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Theme & Appearance</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Customize the application appearance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="theme-toggle" className="dark:text-gray-300">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className={`h-5 w-5 ${theme === 'light' ? 'text-amber-500' : 'text-gray-500 dark:text-gray-400'}`} />
                  <Switch
                    id="theme-toggle"
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                  <Moon className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-500' : 'text-gray-500 dark:text-gray-400'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Notification Preferences</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Customize your alert and notification settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSavePreferences} className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notify-tolls" className="dark:text-gray-300">Toll Plaza Alerts</Label>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">
                        Receive notifications before approaching toll plazas
                      </p>
                    </div>
                    <Switch
                      id="notify-tolls"
                      checked={notifyTolls}
                      onCheckedChange={setNotifyTolls}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notify-weather" className="dark:text-gray-300">Weather Alerts</Label>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">
                        Get notified about adverse weather conditions on your route
                      </p>
                    </div>
                    <Switch
                      id="notify-weather"
                      checked={notifyWeather}
                      onCheckedChange={setNotifyWeather}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-sharing" className="dark:text-gray-300">Data Sharing</Label>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">
                        Share anonymous route data to improve route optimization for all users
                      </p>
                    </div>
                    <Switch
                      id="data-sharing"
                      checked={dataSharing}
                      onCheckedChange={setDataSharing}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="dark:bg-logistics-600 dark:text-white dark:hover:bg-logistics-700">Save Preferences</Button>
              </form>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Security</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Manage your account security and password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Change Password</Button>
                <Button variant="outline" className="text-destructive dark:border-gray-600 dark:hover:bg-gray-700">
                  Log Out from All Devices
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
