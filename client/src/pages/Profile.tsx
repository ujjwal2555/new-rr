import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Building2, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function Profile() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    department: currentUser?.department || ''
  });

  const updateMutation = useMutation({
    mutationFn: (data: { name: string; email: string; department: string }) => 
      api.updateUser(currentUser!.id, data),
    onSuccess: () => {
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully'
      });
      setIsEditing(false);
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    updateMutation.mutate(formData);
  };

  if (!currentUser) return null;

  const roleColors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-700 border-purple-200',
    hr: 'bg-blue-100 text-blue-700 border-blue-200',
    payroll: 'bg-teal-100 text-teal-700 border-teal-200',
    employee: 'bg-indigo-100 text-indigo-700 border-indigo-200'
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-2xl">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{currentUser.name}</h2>
              <p className="text-muted-foreground">{currentUser.email}</p>
              <Badge className={roleColors[currentUser.role]}>
                {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
              </Badge>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  data-testid="input-profile-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  data-testid="input-profile-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  data-testid="input-profile-department"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" data-testid="button-save-profile">Save Changes</Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{currentUser.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{currentUser.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{currentUser.department}</p>
                </div>
              </div>
              <Button onClick={() => setIsEditing(true)} data-testid="button-edit-profile">
                Edit Profile
              </Button>
            </div>
          )}
        </Card>

        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Salary Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Basic Salary</p>
                <p className="text-lg font-bold">₹{currentUser.basicSalary.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">HRA</p>
                <p className="text-lg font-bold">₹{currentUser.hra.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Other Earnings</p>
                <p className="text-lg font-bold">₹{currentUser.otherEarnings.toLocaleString()}</p>
              </div>
              <div className="border-t pt-3">
                <p className="text-sm text-muted-foreground">Gross Salary</p>
                <p className="text-xl font-bold">
                  ₹{(currentUser.basicSalary + currentUser.hra + currentUser.otherEarnings).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Leave Balance</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Annual Leave</p>
                <p className="text-lg font-bold">{currentUser.annualLeave} days</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sick Leave</p>
                <p className="text-lg font-bold">{currentUser.sickLeave} days</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
