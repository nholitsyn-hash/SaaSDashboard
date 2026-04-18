"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Calendar, ChevronDown, Check } from "lucide-react";

/**
 * DateRangePicker — preset-only range selector (Radix Dropdown).
 *
 * WHY presets instead of a calendar:
 * 90% of SaaS analytics usage hits the same 4-5 ranges (7d / 30d / 90d
 * / MTD / YTD). A preset dropdown covers that without pulling in a
 * calendar dep (~40KB for react-day-picker). When a real "custom range"
 * becomes necessary, add the calendar as a 5th item that opens a
 * calendar Dialog — the preset surface doesn't change.
 *
 * WHY controlled (value + onChange), not uncontrolled:
 * The selected range is app state (affects charts, URL params later,
 * analytics tracking). Uncontrolled would hide that coupling inside the
 * component. Controlled makes the data flow explicit.
 */

export type DatePreset = "7d" | "30d" | "90d" | "mtd" | "ytd";

interface DatePresetOption {
  value: DatePreset;
  label: string;
}

const presets: DatePresetOption[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "mtd", label: "Month to date" },
  { value: "ytd", label: "Year to date" },
];

interface DateRangePickerProps {
  value: DatePreset;
  onChange: (value: DatePreset) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const current = presets.find((p) => p.value === value) ?? presets[1];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="
            inline-flex items-center gap-2
            rounded-lg border border-border-default bg-bg-surface
            px-3 py-2 text-sm text-text-primary
            transition-colors
            hover:bg-bg-muted
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-border-focus
          "
        >
          <Calendar size={14} className="text-text-tertiary" />
          <span className="font-medium">{current.label}</span>
          <ChevronDown size={14} className="text-text-tertiary" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="
            z-50 min-w-[180px] rounded-xl border border-border-default
            bg-bg-surface-raised p-1 shadow-lg
          "
        >
          {presets.map((preset) => {
            const selected = preset.value === value;
            return (
              <DropdownMenu.Item
                key={preset.value}
                onSelect={() => onChange(preset.value)}
                className="
                  flex items-center justify-between gap-4
                  rounded-md px-3 py-2 text-sm cursor-pointer outline-none
                  text-text-secondary
                  data-[highlighted]:bg-bg-muted
                  data-[highlighted]:text-text-primary
                "
              >
                <span>{preset.label}</span>
                {selected && <Check size={14} className="text-primary" />}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
