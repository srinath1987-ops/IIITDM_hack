
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
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
      <div className="pt-16">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal and vehicle details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vehicle-reg">Vehicle Registration</Label>
                    <Input 
                      id="vehicle-reg" 
                      value={vehicleReg}
                      onChange={(e) => setVehicleReg(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button type="submit">Save Profile</Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Customize your alert and notification settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSavePreferences} className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notify-tolls">Toll Plaza Alerts</Label>
                      <p className="text-sm text-muted-foreground">
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
                      <Label htmlFor="notify-weather">Weather Alerts</Label>
                      <p className="text-sm text-muted-foreground">
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
                      <Label htmlFor="data-sharing">Data Sharing</Label>
                      <p className="text-sm text-muted-foreground">
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
                
                <Button type="submit">Save Preferences</Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your account security and password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline">Change Password</Button>
                <Button variant="outline" className="text-destructive">
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
