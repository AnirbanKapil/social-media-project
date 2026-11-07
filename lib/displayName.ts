export type DisplayNameUser = {
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
};

export function getFullName(user?: DisplayNameUser | null): string {
  const name = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || user?.username || "";
}
