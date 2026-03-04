// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
import * as React from 'react';

type SandboxFile = {
  path: string;
  language: string;
  code: string;
};

type SandboxOpenIn = {
  label: string;
  href: string;
};

export type SandboxDefinition = {
  id: string;
  title: string;
  description?: string;
  installCommand?: string;
  openIn?: SandboxOpenIn[];
  defaultViewport?: 'desktop' | 'tablet' | 'mobile' | 'custom';
  files: SandboxFile[];
  preview: React.LazyExoticComponent<React.FC>;
};

export const sandboxRegistry: Record<string, SandboxDefinition> = {
  'dashboard-overview': {
    id: 'dashboard-overview',
    title: 'Dashboard Overview',
    description: 'A composed example that combines cards, stats, and team activity.',
    installCommand: 'bunx shadcn@latest add @olwiba/card @olwiba/progress @olwiba/avatar @olwiba/badge @olwiba/button',
    openIn: [
      {
        label: 'Open source package',
        href: 'https://github.com/Olwiba/olwibaCN',
      },
      {
        label: 'Component registry',
        href: 'https://ui.olwiba.com/docs/components',
      },
    ],
    defaultViewport: 'desktop',
    preview: React.lazy(() => import('../demos/sandbox-dashboard-overview')),
    files: [
      {
        path: 'app/page.tsx',
        language: 'tsx',
        code: `import { DashboardOverview } from "@/components/dashboard-overview"

export default function Page() {
  return (
    <main className="container py-10">
      <DashboardOverview />
    </main>
  )
}
`,
      },
      {
        path: 'components/dashboard-overview.tsx',
        language: 'tsx',
        code: `import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
} from "@olwiba/cn"

const metrics = [
  { label: "New users", value: "2,184" },
  { label: "Active trials", value: "317" },
  { label: "Churn", value: "1.9%" },
  { label: "NPS", value: "72" },
]

export function DashboardOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Quarterly Growth</CardTitle>
              <CardDescription>
                Revenue and conversion trends over the last 90 days.
              </CardDescription>
            </div>
            <Badge variant="secondary">+12.4%</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Revenue target</span>
              <span className="font-medium">$94k / $120k</span>
            </div>
            <Progress value={78} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {metrics.map((item) => (
              <div key={item.label} className="rounded-md border p-3">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-lg font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Activity</CardTitle>
          <CardDescription>Latest updates from contributors.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {["Alex", "Morgan", "Riley"].map((name) => (
            <div key={name} className="flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  Updated dashboard filters
                </p>
              </div>
            </div>
          ))}
          <Button className="w-full" variant="outline">
            View all activity
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
`,
      },
      {
        path: 'components/metrics.ts',
        language: 'ts',
        code: `export const metrics = [
  { label: "New users", value: "2,184" },
  { label: "Active trials", value: "317" },
  { label: "Churn", value: "1.9%" },
  { label: "NPS", value: "72" },
]
`,
      },
    ],
  },
};
