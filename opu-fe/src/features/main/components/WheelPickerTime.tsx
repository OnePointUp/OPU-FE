"use client";

import WheelPickerBase from "@/components/common/WheelPickerBase";

export type TimeValue = {
  ampm: "AM" | "PM";
  hour: number;
  minute: number;
};

type Props = {
  value: TimeValue | null;
  onChange: (v: TimeValue) => void;
};

export default function WheelPickerTime({ value, onChange }: Props) {
  // UI용 라벨
  const ampmLabels = ["오전", "오후"] as const;

  // 실제 값은 AM/PM
  const ampmValues = ["AM", "PM"] as const;

  const hourItems = Array.from({ length: 12 }, (_, i) => i + 1);
  const minuteItems = Array.from({ length: 60 }, (_, i) => i);

  const base: TimeValue = value ?? {
    ampm: "AM",
    hour: 9,
    minute: 0,
  };

  // base.ampm("AM" or "PM") → index (0 or 1)
  const ampmIndex = ampmValues.indexOf(base.ampm);

  return (
    <div className="relative flex justify-center items-center gap-4">
      {/* 선택 라인 */}
      <div
        className="
          absolute top-1/2 left-0 right-0 
          h-[40px] -translate-y-1/2 
          pointer-events-none rounded-lg 
          bg-blue-100/20 z-0
        "
      />

      <div className="z-10 flex gap-4 items-center">
        {/* 오전/오후 UI */}
        <div className="w-18">
          <WheelPickerBase
            items={ampmLabels}
            value={ampmLabels[ampmIndex]}
            onChange={(label) => {
              const idx = ampmLabels.indexOf(label);
              onChange({ ...base, ampm: ampmValues[idx] });
            }}
            enableInfinite={false}
          />
        </div>

        {/* 시 */}
        <div className="w-16">
          <WheelPickerBase
            items={hourItems}
            value={base.hour}
            onChange={(hour) => onChange({ ...base, hour })}
          />
        </div>

        {/* 구분자 */}
        <div className="flex items-center justify-center font-bold text-lg pb-1">
          :
        </div>

        {/* 분 */}
        <div className="w-16">
          <WheelPickerBase
            items={minuteItems}
            value={base.minute}
            onChange={(minute) => onChange({ ...base, minute })}
          />
        </div>
      </div>
    </div>
  );
}
