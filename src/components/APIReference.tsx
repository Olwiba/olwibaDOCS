// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
"use client";

import { ChevronRight, Lock } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

interface PropDef {
  name: string;
  type: string;
  default?: string;
  /**
   * What the prop is for.
   *
   * Pages have been passing this since the table was written and it was never
   * read, so several hundred lines of authored explanation sat in the MDX
   * without ever reaching a reader. It is optional because a name and a type
   * are sometimes the whole story, and the column only appears when something
   * has one.
   */
  description?: string;
}

interface APIReferenceProps {
  name: string;
  extends?: string;
  props?: PropDef[];
  /**
   * Renders the closed control without its contents, for documentation the
   * visitor is not entitled to read.
   *
   * This is presentation for a decision made on the server, not the decision
   * itself. It is safe only because the panel is closed by default and its
   * contents are conditionally rendered, so a locked control and a full one
   * are identical in the DOM. Callers must omit `props` entirely: passing
   * them alongside `locked` puts the data in the page for anyone to read.
   */
  locked?: boolean;
}

export function APIReference({ name, extends: extendsEl, props, locked = false }: APIReferenceProps) {
  const [open, setOpen] = useState(false);
  const isOpen = open && !locked;
  const showDescriptions = props?.some((prop) => prop.description) ?? false;

  return (
    <div className="my-2 rounded-lg border">
      <button
        type="button"
        // aria-disabled rather than `disabled`, matching DocsHeader's locked
        // GitHub control: a disabled button stops emitting pointer events, so
        // the title explaining why it cannot open would never appear.
        aria-disabled={locked || undefined}
        aria-expanded={locked ? undefined : open}
        title={locked ? "Sign in to view the API reference" : undefined}
        className={cn(
          "flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium transition-colors",
          locked ? "cursor-not-allowed" : "hover:bg-muted/50"
        )}
        onClick={() => {
          if (locked) return;
          setOpen(!open);
        }}
      >
        <ChevronRight
          className={cn(
            "size-4 shrink-0 transition-transform duration-200",
            locked ? "text-muted-foreground/50" : "text-muted-foreground",
            isOpen && "rotate-90"
          )}
        />
        <code className={cn("text-[0.85rem] font-semibold", locked && "text-muted-foreground")}>
          {`<${name}>`}
        </code>
        {extendsEl && (
          <span className="text-muted-foreground text-xs">
            extends <code className="bg-muted rounded px-1 py-0.5 text-xs">{`<${extendsEl}>`}</code>
          </span>
        )}
        {locked && (
          <>
            <Lock className="ml-auto size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">Locked. Sign in to view the API reference.</span>
          </>
        )}
      </button>
      {isOpen && (
        <div className="border-t px-4 py-3">
          {props && props.length > 0 ? (
            // The type column cannot wrap without becoming unreadable, so on a
            // narrow screen the table has to scroll rather than the page.
            <div className="-mx-1 overflow-x-auto px-1">
              <table className="w-full min-w-[28rem] text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 pr-4 text-left font-bold">Prop</th>
                    <th className="py-2 pr-4 text-left font-bold">Type</th>
                    <th className="py-2 pr-4 text-left font-bold">Default</th>
                    {showDescriptions && (
                      <th className="py-2 text-left font-bold">Description</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {props.map((prop) => (
                    <tr key={prop.name} className="border-b align-top last:border-b-0">
                      <td className="py-2 pr-4">
                        <code className="bg-muted rounded px-1 py-0.5 text-xs">{prop.name}</code>
                      </td>
                      <td className="py-2 pr-4 whitespace-nowrap">
                        <code className="text-xs">{prop.type}</code>
                      </td>
                      <td className="py-2 pr-4">
                        <code className="text-xs">{prop.default ?? "-"}</code>
                      </td>
                      {showDescriptions && (
                        <td className="text-muted-foreground min-w-[14rem] py-2 text-xs">
                          {prop.description ?? ""}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No additional props. Accepts all{" "}
              {extendsEl ? (
                <code className="bg-muted rounded px-1 py-0.5 text-xs">{`<${extendsEl}>`}</code>
              ) : (
                "standard"
              )}{" "}
              attributes.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
