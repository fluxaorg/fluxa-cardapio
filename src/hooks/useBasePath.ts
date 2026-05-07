import { useCompany } from '../context/CompanyContext';
import { useMesa } from '../context/MesaContext';

export function useBasePath(): string {
  const { company } = useCompany();
  const { isMesaMode, mesaNumber } = useMesa();
  const slug = company?.slug || '';
  if (isMesaMode && mesaNumber) return `/${slug}/mesa/${mesaNumber}`;
  return slug ? `/${slug}` : '';
}
