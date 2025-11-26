"use client";

import WheelPickerBase from "@/components/common/WheelPickerBase";

export type TimeValue = {
  ampm: "AM" | "PM";
  hour: number;   // 1 ~ 12
  minute: number; // 0 ~ 59
};

type Props = {
  value: TimeValue | null;               // ⭐ null 허용
  onChange: (v: TimeValue) => void;       // 항상 TimeValue로 반환
};

export default function WheelPickerTime({ value, onChange }: Props) {
  const ampmItems = ["AM", "PM"] as const;
  const hourItems = Array.from({ length: 12 }, (_, i) => i + 1);
  const minuteItems = Array.from({ length: 60 }, (_, i) => i);

  /** ⭐ safeValue: null이 들어와도 기본값으로 보정 */
  const safeValue: TimeValue = value ?? {
    ampm: "AM",
    hour: 9,
    minute: 0,
  };

  return (
    <div className="flex justify-center gap-6 py-4">
      {/* AM/PM */}
      <div className="w-18">
        <WheelPickerBase
            items={ampmItems}
            value={safeValue.ampm}
            onChange={(ampm) => onChange({ ...safeValue, ampm })}
            enableInfinite={false}
        />
      </div>

      {/* Hour */}
      <div className="w-16">
        <WheelPickerBase
            items={hourItems}
            value={safeValue.hour}
            onChange={(hour) => onChange({ ...safeValue, hour })}
        />
      </div>

      {/* Minute */}
      <div className="w-16">
        <WheelPickerBase
            items={minuteItems}
            value={safeValue.minute}
            onChange={(minute) => onChange({ ...safeValue, minute })}
        />
      </div>
    </div>
  );
}
