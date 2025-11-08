import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Building2, 
  FileText, 
  Lock, 
  DollarSign, 
  Plus,
  Briefcase,
  Calendar,
  MapPin,
  Phone
} from 'lucide-react';
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

  const initials = currentUser.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  // Calculate salary details
  const grossSalary = currentUser.basicSalary + currentUser.hra + currentUser.otherEarnings;
  const yearlyGross = grossSalary * 12;
  
  // Salary components with percentages
  const standardAllowance = currentUser.basicSalary;
  const standardAllowancePercent = ((standardAllowance / grossSalary) * 100).toFixed(1);
  
  const lta = currentUser.otherEarnings * 0.3; // 30% of other earnings
  const ltaPercent = ((lta / grossSalary) * 100).toFixed(1);
  
  const performanceBonus = currentUser.otherEarnings * 0.4; // 40% of other earnings
  const performanceBonusPercent = ((performanceBonus / grossSalary) * 100).toFixed(1);
  
  const fixedAllowance = currentUser.hra;
  const fixedAllowancePercent = ((fixedAllowance / grossSalary) * 100).toFixed(1);
  
  // Deductions
  const professionalTax = 200; // Fixed professional tax
  const professionalTaxPercent = ((professionalTax / grossSalary) * 100).toFixed(1);
  
  const pfContribution = grossSalary * 0.12; // 12% PF contribution
  const pfPercent = ((pfContribution / grossSalary) * 100).toFixed(1);
  
  const netSalary = grossSalary - professionalTax - pfContribution;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and settings
        </p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:items-start">
            <Avatar className="w-32 h-32 text-4xl">
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <Badge className={`mt-4 ${roleColors[currentUser.role]}`} data-testid="badge-role">
              {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
            </Badge>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Full Name</p>
              <p className="font-semibold flex items-center gap-2" data-testid="text-name">
                <User className="w-4 h-4 text-muted-foreground" />
                {currentUser.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Login ID</p>
              <p className="font-semibold font-mono text-sm" data-testid="text-login-id">
                {currentUser.loginId}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="font-semibold flex items-center gap-2" data-testid="text-email">
                <Mail className="w-4 h-4 text-muted-foreground" />
                {currentUser.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Mobile</p>
              <p className="font-semibold flex items-center gap-2" data-testid="text-mobile">
                <Phone className="w-4 h-4 text-muted-foreground" />
                {currentUser.mobile || 'Not provided'}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Company</p>
              <p className="font-semibold flex items-center gap-2" data-testid="text-company">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                {currentUser.company || 'Organization Inc'}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Department</p>
              <p className="font-semibold flex items-center gap-2" data-testid="text-department">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                {currentUser.department}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Manager</p>
              <p className="font-semibold" data-testid="text-manager">
                {currentUser.manager || 'N/A'}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Location</p>
              <p className="font-semibold flex items-center gap-2" data-testid="text-location">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                {currentUser.location || 'Not specified'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="resume" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="resume" data-testid="tab-resume">
            <FileText className="w-4 h-4 mr-2" />
            Resume
          </TabsTrigger>
          <TabsTrigger value="private" data-testid="tab-private">
            <User className="w-4 h-4 mr-2" />
            Private Info
          </TabsTrigger>
          <TabsTrigger value="salary" data-testid="tab-salary">
            <DollarSign className="w-4 h-4 mr-2" />
            Salary Info
          </TabsTrigger>
          <TabsTrigger value="security" data-testid="tab-security">
            <Lock className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resume" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Year of Joining</p>
                <p className="font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {currentUser.yearOfJoining}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Role</p>
                <p className="font-semibold capitalize">{currentUser.role}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Department</p>
                <p className="font-semibold">{currentUser.department}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Leave Balance</p>
                <div className="flex gap-4 mt-2">
                  <div className="flex-1 p-3 bg-accent rounded-md">
                    <p className="text-xs text-muted-foreground">Annual Leave</p>
                    <p className="text-xl font-bold">{currentUser.annualLeave} days</p>
                  </div>
                  <div className="flex-1 p-3 bg-accent rounded-md">
                    <p className="text-xs text-muted-foreground">Sick Leave</p>
                    <p className="text-xl font-bold">{currentUser.sickLeave} days</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="private" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">About</h3>
              <Button size="sm" variant="ghost" data-testid="button-edit-about">
                Edit
              </Button>
            </div>
            <Textarea 
              placeholder="Tell us about yourself, your background, and what you love about your job..."
              className="min-h-32"
              defaultValue="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
              data-testid="textarea-about"
            />
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">What I love about my job</h3>
            <Textarea 
              placeholder="Describe what makes your work fulfilling..."
              className="min-h-32"
              defaultValue="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
              data-testid="textarea-job-love"
            />
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">My stories and hobbies</h3>
            <Textarea 
              placeholder="Share your stories, hobbies, and interests..."
              className="min-h-32"
              defaultValue="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
              data-testid="textarea-hobbies"
            />
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Skills</h3>
                <Button size="sm" variant="ghost" data-testid="button-add-skill">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Skills
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">No skills added yet</p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Certification</h3>
                <Button size="sm" variant="ghost" data-testid="button-add-certification">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Skills
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">No certifications added yet</p>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="salary" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Salary Info</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-accent rounded-md">
                <p className="text-sm text-muted-foreground mb-1">Month Wage</p>
                <p className="text-2xl font-bold">₹{grossSalary.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">/ Month</p>
              </div>
              <div className="p-4 bg-accent rounded-md">
                <p className="text-sm text-muted-foreground mb-1">Yearly wage</p>
                <p className="text-2xl font-bold">₹{yearlyGross.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">/ Yearly</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Salary Components</h4>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">Standard Allowance</p>
                        <p className="text-xs text-muted-foreground">A standard allowance is a fixed amount provided to employees</p>
                      </div>
                      <Badge variant="secondary">{standardAllowancePercent}%</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-semibold">₹{standardAllowance.toLocaleString()} / month</p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">Leave Travel Allowance</p>
                        <p className="text-xs text-muted-foreground">LTA is paid by the company for vacation/travel expenses</p>
                      </div>
                      <Badge variant="secondary">{ltaPercent}%</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-semibold">₹{lta.toLocaleString()} / month</p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">Performance Bonus</p>
                        <p className="text-xs text-muted-foreground">Variable bonus paid for meeting performance goals</p>
                      </div>
                      <Badge variant="secondary">{performanceBonusPercent}%</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-semibold">₹{performanceBonus.toLocaleString()} / month</p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">Fixed Allowance</p>
                        <p className="text-xs text-muted-foreground">Fixed allowance portion of wages is determined after excluding all salary components</p>
                      </div>
                      <Badge variant="secondary">{fixedAllowancePercent}%</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-semibold">₹{fixedAllowance.toLocaleString()} / month</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Tax Deductions</h4>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md border-destructive/20 bg-destructive/5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">Professional Tax</p>
                        <p className="text-xs text-muted-foreground">Professional Tax deducted from the gross salary</p>
                      </div>
                      <Badge variant="destructive">{professionalTaxPercent}%</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-semibold text-destructive">-₹{professionalTax.toLocaleString()} / month</p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md border-destructive/20 bg-destructive/5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">Provident Fund (PF) Contribution</p>
                        <p className="text-xs text-muted-foreground">Employer & employee contribute to PF for long-term savings. 12% calculated on the basic salary</p>
                      </div>
                      <Badge variant="destructive">{pfPercent}%</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-semibold text-destructive">-₹{pfContribution.toLocaleString()} / month</p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="p-4 bg-primary/10 rounded-md border-2 border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Net Salary (Take Home)</p>
                    <p className="text-3xl font-bold text-primary">
                      ₹{netSalary.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Per Month</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Security & Access</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Login ID</p>
                <p className="font-semibold font-mono bg-accent px-3 py-2 rounded-md inline-block">
                  {currentUser.loginId}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Role</p>
                <Badge className="capitalize">{currentUser.role}</Badge>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Account Status</p>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                  Active
                </Badge>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Password Change</p>
                <p className="font-semibold">{currentUser.lastPasswordChange || 'Never'}</p>
              </div>
              <Separator />
              
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
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
                <div className="mt-6">
                  <Button variant="outline" onClick={() => setIsEditing(true)} data-testid="button-edit-profile">
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
