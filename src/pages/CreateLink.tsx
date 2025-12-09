import { Navbar } from '@/components/Navbar';
import { CreateLinkForm } from '@/components/CreateLinkForm';
import { Footer } from '@/components/Footer';

const CreateLink = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="pt-24 pb-16 px-4 flex-1">
        <div className="container max-w-4xl mx-auto">
          <CreateLinkForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateLink;
