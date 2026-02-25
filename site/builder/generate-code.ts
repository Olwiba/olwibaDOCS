import { builderComponentMap } from './manifest';

export interface BuilderBlock {
  instanceId: string;
  componentId: string;
}

export function generateBuilderCode(blocks: BuilderBlock[]): string {
  const components = blocks
    .map((block) => builderComponentMap.get(block.componentId))
    .filter((component): component is NonNullable<typeof component> => Boolean(component));

  const imports = new Set<string>();
  for (const component of components) {
    for (const line of component.imports) imports.add(line);
  }

  const importSection = Array.from(imports).sort().join('\n');
  const usageSection = components.length
    ? components.map((component) => `      ${component.snippet}`).join('\n\n')
    : '      {/* Drag components into the canvas to generate code */}';

  return `${importSection}

export default function DocsPageBuilder() {
  return (
    <div className="space-y-6">
${usageSection}
    </div>
  );
}
`;
}
