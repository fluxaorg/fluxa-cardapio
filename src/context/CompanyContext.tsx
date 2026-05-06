import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useParams } from 'react-router-dom';

type Company = {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  banner_url?: string;
  // add other fields if needed
};

type CompanyContextType = {
  company: Company | null;
  loading: boolean;
  error: string | null;
};

const CompanyContext = createContext<CompanyContextType>({
  company: null,
  loading: true,
  error: null,
});

export const useCompany = () => useContext(CompanyContext);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { slug } = useParams<{ slug: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompany() {
      if (!slug) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('food_companies')
        .select('*')
        .eq('slug', slug)
        .single();
        
      if (error) {
        console.error('Error fetching company:', error);
        setError('Restaurante não encontrado');
      } else {
        setCompany(data);
      }
      setLoading(false);
    }
    
    fetchCompany();
  }, [slug]);

  return (
    <CompanyContext.Provider value={{ company, loading, error }}>
      {children}
    </CompanyContext.Provider>
  );
};
