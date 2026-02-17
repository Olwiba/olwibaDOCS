export default function MdxComponentsDemo() {
  return (
    <div className="w-full max-w-lg prose prose-sm dark:prose-invert">
      <h3>Sample Rendered Output</h3>
      <p>
        The <code>mdxComponents</code> mapping provides styled headings, paragraphs,
        code blocks, tables, and special components like <strong>Callout</strong>,{' '}
        <strong>Steps</strong>, and <strong>Tabs</strong>.
      </p>
      <blockquote>All fenced code blocks automatically render with CodeFence.</blockquote>
    </div>
  );
}
