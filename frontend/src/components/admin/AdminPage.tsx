import { ReactNode } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportCsv } from "@/lib/exportCsv";
import { toast } from "sonner";

interface Props {
  title: string;
  description?: string;
  exportName?: string;
  exportRows?: Record<string, unknown>[];
  actions?: ReactNode;
  children: ReactNode;
}

export function AdminPage({ title, description, exportName, exportRows, actions, children }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {actions}
          {exportRows && exportName && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => { exportCsv(exportName, exportRows); toast.success(`Exported ${exportRows.length} rows`); }}
            >
              <Download className="w-4 h-4 mr-2" /> Export this view
            </Button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
