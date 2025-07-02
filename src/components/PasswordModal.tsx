
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalLink, Lock } from 'lucide-react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectTitle: string;
}

const DEMO_PASSWORD = 'ionos1234';
const LINKEDIN_URL = 'https://www.linkedin.com/in/young-burke/';

const PasswordModal = ({ isOpen, onClose, onSuccess, projectTitle }: PasswordModalProps) => {
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showLinkedIn, setShowLinkedIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Demo password attempt for:', projectTitle);
    console.log('Password entered:', password);
    console.log('Correct password:', DEMO_PASSWORD);
    
    if (password === DEMO_PASSWORD) {
      console.log('Password correct, calling onSuccess');
      onSuccess();
      onClose();
      setPassword('');
      setAttempts(0);
      setShowLinkedIn(false);
    } else {
      console.log('Password incorrect, attempt:', attempts + 1);
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {
        setShowLinkedIn(true);
        console.log('Max attempts reached, showing LinkedIn option');
      }
      setPassword('');
    }
  };

  const handleClose = () => {
    onClose();
    setPassword('');
    setAttempts(0);
    setShowLinkedIn(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            🔐 Demo Access Required
          </DialogTitle>
          <DialogDescription>
            Enter the password to view the demo for "{projectTitle}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter demo password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
            <Button type="submit" className="w-full">
              Access Demo
            </Button>
          </form>

          {attempts > 0 && !showLinkedIn && (
            <p className="text-sm text-red-500 text-center">
              ❌ Incorrect password. {attempts >= 2 ? 'Maximum attempts reached.' : `${3 - attempts} attempts remaining.`}
            </p>
          )}

          {showLinkedIn && (
            <div className="border-t pt-4 space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                📧 Need access? Connect with me on LinkedIn to request the demo password.
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  console.log('Opening LinkedIn URL:', LINKEDIN_URL);
                  window.open(LINKEDIN_URL, '_blank');
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Connect on LinkedIn
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordModal;
