import { useLocation } from "react-router-dom";

export function useEstatePaths() {
  const { pathname } = useLocation();
  const isEstateDirector = pathname.startsWith("/estate-director");

  return {
    estates: isEstateDirector ? "/estate-director/estates" : "/estates",
    maintenance: isEstateDirector
      ? "/estate-director/estates/maintenance"
      : "/estate-maintenance",
    security: isEstateDirector
      ? "/estate-director/estates/security-codes"
      : "/estate-security-codes",
    utility: isEstateDirector
      ? "/estate-director/estates/utility-payments"
      : "/estate-utility-payments",
    users: (estateId: string | number) =>
      isEstateDirector
        ? `/estate-director/estates/${estateId}/users`
        : `/estates/${estateId}/users`,
    user: (estateId: string | number, userId: string | number) =>
      isEstateDirector
        ? `/estate-director/estates/${estateId}/users/${userId}`
        : `/estates/${estateId}/users/${userId}`,
  };
}
