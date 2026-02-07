import React from 'react';
import { BibleVerseManager } from '@/components/bible-verses/BibleVerseManager';

const BibleVersesPage: React.FC = () => {
  return (
    <div className="p-6">
      <BibleVerseManager />
    </div>
  );
};

export default BibleVersesPage;