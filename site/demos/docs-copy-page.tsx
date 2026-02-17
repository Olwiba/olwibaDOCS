import { DocsCopyPage } from '@/components/DocsCopyPage';

const sampleMarkdown = `# Getting Started

Install the package:

\`\`\`bash
npm install @olwiba/docs
\`\`\`

Then import and use the components in your project.`;

export default function DocsCopyPageDemo() {
  return (
    <div className="w-full max-w-xs">
      <DocsCopyPage page={sampleMarkdown} url="https://docs.olwiba.com/docs" />
    </div>
  );
}
