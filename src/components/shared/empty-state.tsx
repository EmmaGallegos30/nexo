import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-5 py-12 text-center sm:py-16">
      <div
        aria-hidden="true"
        className="mb-6 flex size-14 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 text-primary [&_svg]:size-6 [&_svg]:stroke-[1.5]"
      >
        {icon}
      </div>
      <h2 className="max-w-md text-xl font-medium tracking-tight">{title}</h2>
      <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">
        {description}
      </p>
      {children && <div className="mt-7">{children}</div>}
    </div>
  );
}
