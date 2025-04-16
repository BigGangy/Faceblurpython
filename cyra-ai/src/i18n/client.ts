import { useTranslation as useTranslationOrg } from 'react-i18next';
import { useParams } from 'next/navigation';

export function useTranslation(ns?: string, options: { keyPrefix?: string } = {}) {
  const { lng } = useParams();
  const ret = useTranslationOrg(ns, options);
  const { i18n } = ret;
  if (i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng as string);
  }
  return ret;
} 