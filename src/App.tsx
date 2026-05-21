import { useState } from 'react';

import { NavBar } from '@/components';
import { ContactDetailsPage } from '@/pages';

const App = () => {
  const [notesOpen, setNotesOpen] = useState(true);

  return (
    <div className="flex h-screen gap-4 overflow-hidden p-4" style={{ backgroundColor: '#F7F8FA' }}>
      <ContactDetailsPage
        notesOpen={notesOpen}
        onCloseNotes={() => setNotesOpen(false)}
      />
      <NavBar notesOpen={notesOpen} onToggleNotes={() => setNotesOpen((prev) => !prev)} />
    </div>
  );
};

export default App;
