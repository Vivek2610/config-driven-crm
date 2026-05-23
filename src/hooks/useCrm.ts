import { useContext } from 'react';

import { CrmContext } from '@/context/CrmContext';

export const useCrm = () => {
  const ctx = useContext(CrmContext);
  if (!ctx) throw new Error('useCrm must be used within a CrmProvider');
  return ctx;
};
