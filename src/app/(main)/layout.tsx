import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, var(--background) 0%, var(--primary-50) 50%, var(--background) 100%)' }}>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
