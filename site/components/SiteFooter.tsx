import { DocsFooter } from '@/components/DocsFooter';

export function SiteFooter() {
  return (
    <DocsFooter
      changelogUrl="https://github.com/Olwiba/olwibaDOCS/blob/master/CHANGELOG.md"
      links={[
        {
          label: '🪲 Report a bug',
          href: 'https://github.com/Olwiba/olwibaDOCS/issues/new?template=bug_report.md',
        },
        {
          label: '✨ Feature request',
          href: 'https://github.com/Olwiba/olwibaDOCS/issues/new?template=feature_request.md',
        },
      ]}
    />
  );
}
