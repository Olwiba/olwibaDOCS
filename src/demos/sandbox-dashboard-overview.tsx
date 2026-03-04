// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
'use client';

import {
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
} from '@olwiba/cn';

export default function SandboxDashboardOverviewDemo() {
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
            {[
              { label: 'New users', value: '2,184' },
              { label: 'Active trials', value: '317' },
              { label: 'Churn', value: '1.9%' },
              { label: 'NPS', value: '72' },
            ].map((item) => (
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
          {['Alex', 'Morgan', 'Riley'].map((name) => (
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
  );
}
