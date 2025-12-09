import { Navbar } from '@/components/Navbar';
import { Dashboard } from '@/components/Dashboard';
import { Footer } from '@/components/Footer';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="pt-24 pb-16 px-4 flex-1">
        <div className="container max-w-4xl mx-auto">
          <Dashboard />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
