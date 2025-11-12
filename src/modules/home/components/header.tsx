import { BookOpen, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">LinguaLearn</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/collections"
            className={cn(
              'text-foreground hover:text-primary transition-colors font-medium',
              isActive('/collections') && 'text-primary',
            )}
          >
            Collections
          </Link>
          <Link
            to="/quiz"
            className={cn(
              'text-foreground hover:text-primary transition-colors font-medium',
              isActive('/quiz') && 'text-primary',
            )}
          >
            Quiz
          </Link>
          <Link
            to="/progress"
            className={cn(
              'text-foreground hover:text-primary transition-colors font-medium',
              isActive('/progress') && 'text-primary',
            )}
          >
            Progress
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/progress">
            <Button variant="ghost" size="icon">
              <Trophy className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/flashcard">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
