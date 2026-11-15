import { AppProviders } from "@/app/context/provider";

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppProviders>{children}</AppProviders>;
}
