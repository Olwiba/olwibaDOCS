import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@olwiba/cn';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div className="flex flex-col flex-1 justify-center items-center px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">
        olwiba<span className="text-blue-400">DOCS</span>
      </h1>
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
