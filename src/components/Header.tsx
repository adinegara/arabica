import arabicaLogo from '@/assets/arabica-logo.png';
import { Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container px-4 sm:px-6 flex items-center justify-between h-12 sm:h-14">
        <a href="/" className="flex items-center gap-2">
          <img 
            src={arabicaLogo} 
            alt="Arabica logo" 
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
          />
          <span className="font-semibold text-sm sm:text-base">Arabica</span>
        </a>
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <Globe className="h-4 w-4" />
                <span className="sr-only">Switch language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => setLanguage('en')}
                className={language === 'en' ? 'bg-accent' : ''}
              >
                🇬🇧 English
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setLanguage('id')}
                className={language === 'id' ? 'bg-accent' : ''}
              >
                🇮🇩 Indonesia
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-8 w-8"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">{t('toggleTheme')}</span>
          </Button>
          
          <a 
            href="#docs" 
            className="pill-btn text-xs"
          >
            {t('docs')}
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;