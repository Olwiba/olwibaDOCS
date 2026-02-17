import { CodeFence } from '@/components/CodeFence';

const sampleCode = `import { CodeFence } from '@olwiba/docs';

function App() {
  return <CodeFence code="hello world" />;
}`;

export default function CodeFenceDemo() {
  return (
    <div className="w-full max-w-lg">
      <CodeFence code={sampleCode} />
    </div>
  );
}
