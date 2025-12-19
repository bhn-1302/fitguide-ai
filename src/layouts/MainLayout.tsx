import type { ReactNode } from "react";
import { Header } from "../components/Header";
import { Container } from "../components/Container";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-dvh">
      <Header />
      <main className="py-6">
        <Container>{children}</Container>
      </main>
    </div>
  );
};
