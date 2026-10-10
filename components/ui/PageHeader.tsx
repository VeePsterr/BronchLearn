import type { ReactNode } from "react";

export function PageHeader({ title, intro, children }: { title: string; intro?: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {intro && <p className="mt-2 max-w-3xl text-lg text-muted">{intro}</p>}
      {children}
    </div>
  );
}
