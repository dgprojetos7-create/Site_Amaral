import { useContext } from 'react';
import { PublicSiteContext } from './PublicSiteContext';

export const usePublicSite = () => {
  const context = useContext(PublicSiteContext);

  if (!context) {
    throw new Error('usePublicSite must be used within a PublicSiteProvider');
  }

  return context;
};
