"use client";

import * as Switch from "@radix-ui/react-switch";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useId } from "react";

export function LabeledSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <Switch.Root
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="relative h-6 w-11 shrink-0 rounded-full border border-line bg-surface-2 data-[state=checked]:bg-accent"
      >
        <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-surface shadow transition-transform data-[state=checked]:translate-x-[1.3rem]" />
      </Switch.Root>
      <label htmlFor={id} className="text-sm font-medium">
        {label}: <span className="font-semibold">{checked ? "On" : "Off"}</span>
      </label>
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
}) {
  return (
    <div>
      <p className="mb-1 text-sm font-medium" id={`${label}-lbl`}>{label}</p>
      <ToggleGroup.Root
        type="single"
        value={value}
        onValueChange={(v) => v && onChange(v as T)}
        aria-labelledby={`${label}-lbl`}
        className="inline-flex flex-wrap rounded-lg border border-line bg-surface p-0.5"
      >
        {options.map((o) => (
          <ToggleGroup.Item
            key={o.value}
            value={o.value}
            className="rounded-md px-3 py-1.5 text-sm data-[state=on]:bg-accent data-[state=on]:font-semibold data-[state=on]:text-on-accent"
          >
            {o.label}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  );
}
