// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.
"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

interface PropDef {
  name: string;
  type: string;
  default?: string;
}

interface APIReferenceProps {
  name: string;
  extends?: string;
  props?: PropDef[];
}

export function APIReference({ name, extends: extendsEl, props }: APIReferenceProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="my-2 rounded-lg border">
      <button
        type="button"
        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-muted/50"
        onClick={() => setOpen(!open)}
      >
        <ChevronRight
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-90"
          )}
        />
        <code className="text-[0.85rem] font-semibold">{`<${name}>`}</code>
        {extendsEl && (
          <span className="text-muted-foreground text-xs">
            extends <code className="bg-muted rounded px-1 py-0.5 text-xs">{`<${extendsEl}>`}</code>
          </span>
        )}
      </button>
      {open && (
        <div className="border-t px-4 py-3">
          {props && props.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-4 text-left font-bold">Prop</th>
                  <th className="py-2 pr-4 text-left font-bold">Type</th>
                  <th className="py-2 text-left font-bold">Default</th>
                </tr>
              </thead>
              <tbody>
                {props.map((prop) => (
                  <tr key={prop.name} className="border-b last:border-b-0">
                    <td className="py-2 pr-4">
                      <code className="bg-muted rounded px-1 py-0.5 text-xs">{prop.name}</code>
                    </td>
                    <td className="py-2 pr-4 whitespace-nowrap">
                      <code className="text-xs">{prop.type}</code>
                    </td>
                    <td className="py-2">
                      <code className="text-xs">{prop.default ?? "-"}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
