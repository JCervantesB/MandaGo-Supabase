import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Mail } from 'lucide-react';

interface MessagePageProps {
  title: string;
  description: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
}

export default function MessagePage({ title, description, variant = 'info' }: MessagePageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              variant === 'info' ? 'bg-primary/10' :
              variant === 'success' ? 'bg-success/10' :
              variant === 'warning' ? 'bg-yellow-500/10' :
              'bg-danger/10'
            }`}>
              <Mail className={`w-8 h-8 ${
                variant === 'info' ? 'text-primary' :
                variant === 'success' ? 'text-success' :
                variant === 'warning' ? 'text-yellow-600' :
                'text-danger'
              }`} />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-text">{title}</h1>
          </div>
        </CardHeader>
        <CardContent>
          <Alert variant={variant === 'info' ? 'info' : variant} className="text-center">
            {description}
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
