import { createFileRoute, Link } from '@tanstack/react-router';
import { AsciiText, Button } from '@olwiba/cn';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div className="flex flex-col flex-1 min-h-[calc(100svh-var(--header-height)-var(--footer-height))] justify-center items-center px-4 py-16 text-center">
      <AsciiText text="olwibaDOCS" accent="DOCS" accentColor="var(--primary)" />
      <p className="text-muted-foreground text-lg mb-8 max-w-md">
      Fumadocs abstraction for TanStack Start documentation sites. Build beautiful docs with ease.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link to="/docs/$" params={{ _splat: '' }}>
            Get Started
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/docs/$" params={{ _splat: 'components' }}>
            Components
          </Link>
        </Button>
      </div>
    </div>
  );
}
