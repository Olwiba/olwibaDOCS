import * as React from 'react';
import { Link } from '@tanstack/react-router';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@olwiba/cn';
import { cn } from './utils';
import { CodeFence } from '../components/CodeFence';
import { Callout } from '../components/Callout';
import { APIReference } from '../components/APIReference';
import { ThemeSelector } from '../components/ThemeSelector';
import { ThemeCodeBlock } from '../components/ThemeCodeBlock';
import { Sandbox } from '../components/Sandbox';

/**
 * Default MDX component mappings for olwibaDOCS.
 *
 * Usage:
 * ```tsx
 * import { mdxComponents } from '@olwiba/docs/mdx';
 * import defaultMdxComponents from 'fumadocs-ui/mdx';
 *
 * <MDX components={{ ...defaultMdxComponents, ...mdxComponents }} />
 * ```
 */
export const mdxComponents = {
  h1: ({ className, ...props }: React.ComponentProps<'h1'>) => (
    <h1
      className={cn(
        'font-heading mt-2 scroll-m-28 text-3xl font-bold tracking-tight',
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.ComponentProps<'h2'>) => (
    <h2
      id={props.children
        ?.toString()
        .replace(/ /g, '-')
        .replace(/'/g, '')
        .replace(/\?/g, '')
        .toLowerCase()}
      className={cn(
        'font-heading mt-10 scroll-m-28 text-xl font-medium tracking-tight first:mt-0 lg:mt-16 [&+h3]:!mt-6 [&+p]:!mt-4',
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.ComponentProps<'h3'>) => (
    <h3
      className={cn(
        'font-heading mt-12 scroll-m-28 text-lg font-medium tracking-tight [&+p]:!mt-4',
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.ComponentProps<'h4'>) => (
    <h4
      className={cn(
        'font-heading mt-8 scroll-m-28 text-base font-medium tracking-tight',
        className
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }: React.ComponentProps<'a'>) => (
    <a
      className={cn('font-medium underline underline-offset-4', className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.ComponentProps<'p'>) => (
    <p
      className={cn('leading-relaxed [&:not(:first-child)]:mt-6', className)}
      {...props}
    />
  ),
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className={cn('font-medium', className)} {...props} />
  ),
  ul: ({ className, ...props }: React.ComponentProps<'ul'>) => (
    <ul className={cn('my-6 ml-6 list-disc', className)} {...props} />
  ),
  ol: ({ className, ...props }: React.ComponentProps<'ol'>) => (
    <ol className={cn('my-6 ml-6 list-decimal', className)} {...props} />
  ),
  li: ({ className, ...props }: React.ComponentProps<'li'>) => (
    <li className={cn('mt-2', className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.ComponentProps<'blockquote'>) => (
    <blockquote
      className={cn('mt-6 border-l-2 pl-6 italic', className)}
      {...props}
    />
  ),
  img: ({ className, alt, ...props }: React.ComponentProps<'img'>) => (
    <img className={cn('rounded-md', className)} alt={alt} {...props} />
  ),
  hr: ({ ...props }: React.ComponentProps<'hr'>) => (
    <hr className="my-4 md:my-8" {...props} />
  ),
  table: ({ className, ...props }: React.ComponentProps<'table'>) => (
    <div className="no-scrollbar my-6 w-full overflow-y-auto rounded-lg border">
      <table
        className={cn(
          'relative w-full overflow-hidden border-none text-sm [&_tbody_tr:last-child]:border-b-0',
          className
        )}
        {...props}
      />
    </div>
  ),
  tr: ({ className, ...props }: React.ComponentProps<'tr'>) => (
    <tr className={cn('m-0 border-b', className)} {...props} />
  ),
  th: ({ className, ...props }: React.ComponentProps<'th'>) => (
    <th
      className={cn(
        'px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.ComponentProps<'td'>) => (
    <td
      className={cn(
        'px-4 py-2 text-left whitespace-nowrap [&[align=center]]:text-center [&[align=right]]:text-right',
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, children, ...props }: React.ComponentProps<'pre'>) => (
    <CodeFence className={className}>{children}</CodeFence>
  ),
  code: ({ className, children, ...props }: React.ComponentProps<'code'>) => {
    if (typeof children === 'string') {
      return (
        <code
          className={cn(
            'bg-muted relative rounded-md px-[0.3rem] py-[0.2rem] font-mono text-[0.8rem] break-words outline-none',
            className
          )}
          {...props}
        >
          {children}
        </code>
      );
    }
    return <code {...props}>{children}</code>;
  },
  Step: ({ className, ...props }: React.ComponentProps<'h3'>) => (
    <h3
      className={cn(
        'font-heading mt-8 scroll-m-32 text-xl font-medium tracking-tight',
        className
      )}
      {...props}
    />
  ),
  Steps: ({ ...props }) => (
    <div
      className="[&>h3]:step steps mb-12 [counter-reset:step] *:[h3]:first:!mt-0"
      {...props}
    />
  ),
  Tabs: ({ className, ...props }: React.ComponentProps<typeof Tabs>) => (
    <Tabs className={cn('relative mt-6 w-full', className)} {...props} />
  ),
  TabsList: ({ className, ...props }: React.ComponentProps<typeof TabsList>) => (
    <TabsList
      className={cn(
        'justify-start gap-4 rounded-none bg-transparent px-0',
        className
      )}
      {...props}
    />
  ),
  TabsTrigger: ({ className, ...props }: React.ComponentProps<typeof TabsTrigger>) => (
    <TabsTrigger
      className={cn(
        'text-muted-foreground data-[state=active]:text-foreground data-[state=active]:border-primary hover:text-primary rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-3 text-base data-[state=active]:bg-transparent data-[state=active]:shadow-none',
        className
      )}
      {...props}
    />
  ),
  TabsContent: ({ className, ...props }: React.ComponentProps<typeof TabsContent>) => (
    <TabsContent
      className={cn(
        'relative [&_h3.font-heading]:text-base [&_h3.font-heading]:font-medium',
        className
      )}
      {...props}
    />
  ),
  Button,
  Callout,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertTitle,
  AlertDescription,
  APIReference,
  CodeFence,
  ThemeSelector,
  ThemeCodeBlock,
  Sandbox,
  Link: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn('font-medium underline underline-offset-4', className)}
      {...props}
    />
  ),
};

export type MdxComponents = typeof mdxComponents;
