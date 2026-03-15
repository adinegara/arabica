import Header from '@/components/Header';
import PegonConverter from '@/components/PegonConverter';
import PegonBakuSection from '@/components/PegonBakuSection';
import { useLanguage } from '@/contexts/LanguageContext';

const Pegon = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 sm:px-6 py-16 sm:py-20">
        {/* Hero */}
        <div className="text-center mb-8 sm:mb-10 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
            <span className="text-primary">Pegon</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base px-4">
            {t('pegonTagline')}
          </p>
        </div>

        <PegonConverter />

        <PegonBakuSection />

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 text-center text-xs text-muted-foreground space-y-2">
          <p>{t('footer')}</p>
          <p>
            {t('createdBy')}{' '}
            <a href="https://instagram.com/netizenz" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
              @netizenz
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Pegon;
