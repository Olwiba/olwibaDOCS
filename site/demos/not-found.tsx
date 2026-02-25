'use client';

import { AsciiText } from '@olwiba/cn';

export default function NotFoundDemo() {
  return (
    <div className="flex flex-col justify-center items-center px-4 py-8 text-center w-full">
      <AsciiText text="404" accent="404" accentColor="var(--primary)" />
      <p className="text-muted-foreground text-lg max-w-md -mt-4">Page not found.</p>
    </div>
  );
}
