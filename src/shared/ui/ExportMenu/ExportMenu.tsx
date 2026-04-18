"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Download, FileSpreadsheet, FileText } from "lucide-react";

/**
 * ExportMenu — dropdown button with CSV / PDF export actions.
 *
 * WHY a dropdown (not two separate buttons):
 * Export targets are mutually exclusive at the moment of action — the
 * user picks one. Dropdown keeps the primary bar compact and leaves room
 * to add Excel / JSON / scheduled-export items later without re-working
 * layout.
 *
 * WHY callbacks (not an internal implementation):
 * Different reports serialize different shapes. Making the component
 * dumb (pass handlers, component invokes on select) means reports can
 * format their own CSV columns and the menu stays reusable across every
 * export surface in the app.
 */

interface ExportMenuProps {
  onExportCsv: () => void;
  onExportPdf: () => void;
  disabled?: boolean;
}

export function ExportMenu({
  onExportCsv,
  onExportPdf,
  disabled,
}: ExportMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="
            inline-flex items-center gap-2
            rounded-lg border border-border-default bg-bg-surface
            px-3 py-2 text-sm font-medium text-text-primary
            transition-colors
            hover:bg-bg-muted
            disabled:opacity-50 disabled:cursor-not-allowed
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-border-focus
          "
        >
          <Download size={14} className="text-text-tertiary" />
          Export
          <ChevronDown size={14} className="text-text-tertiary" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="
            z-50 min-w-[160px] rounded-xl border border-border-default
            bg-bg-surface-raised p-1 shadow-lg
          "
        >
          <DropdownMenu.Item
            onSelect={onExportCsv}
            className="
              flex items-center gap-2
              rounded-md px-3 py-2 text-sm cursor-pointer outline-none
              text-text-secondary
              data-[highlighted]:bg-bg-muted
              data-[highlighted]:text-text-primary
            "
          >
            <FileSpreadsheet size={14} />
            Export CSV
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={onExportPdf}
            className="
              flex items-center gap-2
              rounded-md px-3 py-2 text-sm cursor-pointer outline-none
              text-text-secondary
              data-[highlighted]:bg-bg-muted
              data-[highlighted]:text-text-primary
            "
          >
            <FileText size={14} />
            Export PDF
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
