// src/lib/auth-utils.ts
export const getActiveOrgId = () => {
  if (typeof window === 'undefined') return 'default';
  const match = document.cookie.match(new RegExp('(^| )orgId=([^;]+)'));
  return match ? match[2] : 'guest';
};