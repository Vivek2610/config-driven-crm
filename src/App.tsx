import { UiLayoutProvider } from '@/context';
import { ContactDetailsPage } from '@/pages';

const App = () => (
  <UiLayoutProvider>
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: '#F7F8FA' }}
    >
      <ContactDetailsPage />
    </div>
  </UiLayoutProvider>
);

export default App;
