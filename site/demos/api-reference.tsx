import { APIReference } from '@/components/APIReference';

export default function APIReferenceDemo() {
  return (
    <div className="w-full max-w-lg">
      <APIReference
        name="Button"
        props={[
          { name: 'variant', type: '"default" | "outline" | "ghost"', default: '"default"' },
          { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"' },
          { name: 'disabled', type: 'boolean', default: 'false' },
        ]}
      />
    </div>
  );
}
