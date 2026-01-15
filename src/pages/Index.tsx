import Header from '@/components/Header';
import Transliterator from '@/components/Transliterator';
import DocsSection from '@/components/DocsSection';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 sm:px-6 py-16 sm:py-20">
        {/* Hero */}
        <div className="text-center mb-8 sm:mb-10 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
            <span className="text-primary">Arabica</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base px-4">
            {t('tagline')}
          </p>
        </div>

        <Transliterator />
        
        <div id="docs">
          <DocsSection />
        </div>

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 text-center text-xs text-muted-foreground">
          <p>{t('footer')}</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;