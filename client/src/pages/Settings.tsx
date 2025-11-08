import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, RotateCcw } from 'lucide-react';
import { getDataStore, saveDataStore, resetDataStore } from '@/lib/dataStore';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function Settings() {
  const { toast } = useToast();
  const data = getDataStore();
  const [settings, setSettings] = useState(data.settings);

  const handleSave = () => {
    data.settings = settings;
    saveDataStore(data);

    toast({
      title: 'Settings Saved',
      description: 'System settings have been updated'
    });
  };

  const handleReset = () => {
    resetDataStore();
    window.location.reload();
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage system settings and configurations
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5" />
          Payroll Settings
        </h2>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="pfPercent">Provident Fund (%)</Label>
            <Input
              id="pfPercent"
              type="number"
              value={settings.pfPercent}
              onChange={(e) => setSettings({ ...settings, pfPercent: parseFloat(e.target.value) })}
              data-testid="input-pf-percent"
            />
            <p className="text-xs text-muted-foreground">
              Percentage of basic salary deducted for PF
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="professionalTax">Professional Tax (₹)</Label>
            <Input
              id="professionalTax"
              type="number"
              value={settings.professionalTax}
              onChange={(e) => setSettings({ ...settings, professionalTax: parseFloat(e.target.value) })}
              data-testid="input-professional-tax"
            />
            <p className="text-xs text-muted-foreground">
              Fixed amount deducted as professional tax
            </p>
          </div>
          <Button onClick={handleSave} data-testid="button-save-settings">
            Save Settings
          </Button>
        </div>
      </Card>

      <Card className="p-6 border-destructive">
        <h2 className="text-xl font-semibold mb-4 text-destructive flex items-center gap-2">
          <RotateCcw className="w-5 h-5" />
          Danger Zone
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Reset all demo data to initial state. This action will delete all changes and restore default data.
        </p>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" data-testid="button-reset-demo">
              Reset Demo Data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all your changes
                and reset the demo data to its initial state. The page will reload automatically.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset} data-testid="button-confirm-reset">
                Reset Data
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </div>
  );
}
