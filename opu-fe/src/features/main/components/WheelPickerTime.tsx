"use client";

import WheelPickerBase from "@/components/common/WheelPickerBase";

export type TimeValue = {
  ampm: "AM" | "PM";
  hour: number;   // 1 ~ 12
  minute: number; // 0 ~ 59
};

type Props = {
  value: TimeValue | null;
  onChange: (v: TimeValue) => void;
};

export default function WheelPickerTime({ value, onChange }: Props) {
  const ampmItems = ["AM", "PM"] as const;
  const hourItems = Array.from({ length: 12 }, (_, i) => i + 1);
  const minuteItems = Array.from({ length: 60 }, (_, i) => i);

  const base: TimeValue = value ?? {
    ampm: "AM",
    hour: 9,
    minute: 0,
  };

  return (
    <div className="flex justify-center gap-6 py-4">
      <div className="w-18">
        <WheelPickerBase
          items={ampmItems}
          value={base.ampm}
          onChange={(ampm) => onChange({ ...base, ampm })}
          enableInfinite={false}
        />
      </div>

      <div className="w-16">
        <WheelPickerBase
          items={hourItems}
          value={base.hour}
          onChange={(hour) => onChange({ ...base, hour })}
        />
      </div>

      <div className="w-16">
        <WheelPickerBase
          items={minuteItems}
          value={base.minute}
          onChange={(minute) => onChange({ ...base, minute })}
        />
      </div>
    </div>
  );
}
