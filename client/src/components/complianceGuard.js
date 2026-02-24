import { useState, useEffect } from 'react';
import api from '../services/api';
import TermsModal from './terms/index';

export function ComplianceGuard({ children }) {
  const [pendingTerm, setPendingTerm] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkTerms = async () => {
      try {
        const response = await api.get('/terms/check');
        if (response.data.mustAccept) {
          setPendingTerm(response.data.term);
        }
      } catch (err) {
        console.error("Compliance check failed", err);
      } finally {
        setChecking(false);
      }
    };

    checkTerms();
  }, []);

  if (checking) return null; 

  return (
    <>
      {pendingTerm && (
        <TermsModal 
          termData={pendingTerm} 
          onAccepted={() => setPendingTerm(null)} 
        />
      )}
      {children}
    </>
  );
}