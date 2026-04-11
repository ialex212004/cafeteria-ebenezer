import Navigation from '../components/shared/Navigation';
import Footer from '../components/shared/Footer';
import RevealObserver from '../components/RevealObserver';

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <RevealObserver />
      {children}
      <Footer />
    </>
  );
}
