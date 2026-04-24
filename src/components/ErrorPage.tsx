// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
import * as React from "react"
import { ArrowLeft } from "lucide-react"
import { cn } from "../lib/utils"
import { AsciiText } from './AsciiText'
import {
  Button,
  UIVariantProvider,
} from '@olwiba/cn';


export type RenderLinkFn = (props: {
  href: string
  children: React.ReactNode
  className?: string
}) => React.ReactNode

const defaultRenderLink: RenderLinkFn = ({ href, children }) => (
  <a href={href}>{children}</a>
)

export interface ErrorPageProps {
  statusCode?: string
  title?: string
  description?: string
  action?: { label: string; href: string }
  backAction?: { label: string; href?: string; onClick?: () => void }
  renderLink?: RenderLinkFn
  mode?: "playful" | "smooth"
  className?: string
}

export function ErrorPage({
  statusCode = "404",
  title = "Page not found",
  description = "The page you're looking for doesn't exist or has been moved. Check the URL or head back home.",
  action = { label: "Take me home", href: "/" },
  backAction = { label: "Go back" },
  renderLink = defaultRenderLink,
  mode,
  className,
}: ErrorPageProps) {
  return (
    <UIVariantProvider mode={mode}>
      <div className={cn("flex flex-col items-center justify-center px-6 py-16 text-center", className)}>
        <div className="space-y-6">
          <div className="space-y-2">
            <AsciiText text={statusCode} accent={statusCode} accentColor="var(--primary)" />
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {backAction && (
              backAction.href
                ? renderLink({
                    href: backAction.href,
                    children: (
                      <Button variant="outline">
                        <ArrowLeft className="size-4" />
                        {backAction.label}
                      </Button>
                    ),
                  })
                : (
                  <Button variant="outline" onClick={backAction.onClick}>
                    <ArrowLeft className="size-4" />
                    {backAction.label}
                  </Button>
                )
            )}
            {action && renderLink({
              href: action.href,
              children: <Button>{action.label}</Button>,
            })}
          </div>
        </div>
      </div>
    </UIVariantProvider>
  )
}
