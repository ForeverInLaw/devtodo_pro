import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import SettingsSection from './SettingsSection';
import Button from '../../../components/ui/Button';

const AccountSettings = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <SettingsSection
      title="Account"
      description={`You are currently logged in as ${user?.email || 'Unknown user'}`}
      icon="User"
    >
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2">Log Out</h4>
          <p className="text-xs text-muted-foreground mb-3">
            You will be returned to the login screen.
          </p>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            iconName="LogOut"
          >
            Log Out
          </Button>
        </div>
      </div>
    </SettingsSection>
  );
};

export default AccountSettings;