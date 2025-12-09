import { Navbar } from '@/components/Navbar';
import { CreateLinkForm } from '@/components/CreateLinkForm';

const CreateLink = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <CreateLinkForm />
        </div>
      </main>
    </div>
  );
};

export default CreateLink;
