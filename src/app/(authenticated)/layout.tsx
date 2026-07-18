import { AppShell } from "@/components/layout/AppShell";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return <AppShell>{children}</AppShell>;
}
