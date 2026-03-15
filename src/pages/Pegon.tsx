import Header from '@/components/Header';
import PegonConverter from '@/components/PegonConverter';
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

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 text-center text-xs text-muted-foreground">
          <p>{t('footer')}</p>
        </footer>
      </main>
    </div>
  );
};

export default Pegon;
