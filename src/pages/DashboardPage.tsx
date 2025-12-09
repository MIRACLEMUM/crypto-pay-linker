import { Navbar } from '@/components/Navbar';
import { Dashboard } from '@/components/Dashboard';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <Dashboard />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
