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

// 모든 WheelPicker가 공유할 공통 높이
const ITEM_HEIGHT = 40;

export default function WheelPickerTime({ value, onChange }: Props) {
  const ampmLabels = ["오전", "오후"] as const;
  const ampmValues = ["AM", "PM"] as const;

  const hourItems = Array.from({ length: 12 }, (_, i) => i + 1);
  const minuteItems = Array.from({ length: 60 }, (_, i) => i);

  const base: TimeValue = value ?? {
    ampm: "AM",
    hour: 9,
    minute: 0,
  };

  const ampmIndex = ampmValues.indexOf(base.ampm);

  return (
    <div className="relative flex justify-center items-center gap-4">
      <div
        className="
          absolute top-1/2 left-0 right-0 
          -translate-y-1/2 pointer-events-none 
          rounded-lg bg-blue-100/20 z-0
        "
        style={{ height: ITEM_HEIGHT }}
      />

      <div className="z-10 flex gap-4 items-center">
        {/* 오전/오후 */}
        <div className="w-18">
          <WheelPickerBase
            items={ampmLabels}
            value={ampmLabels[ampmIndex]}
            onChange={(label) => {
              const idx = ampmLabels.indexOf(label);
              onChange({ ...base, ampm: ampmValues[idx] });
            }}
            enableInfinite={false}
            itemHeight={ITEM_HEIGHT}
            height={ITEM_HEIGHT * 3}   // 기본 3칸 표시
          />
        </div>

        {/* 시 */}
        <div className="w-16">
          <WheelPickerBase
            items={hourItems}
            value={base.hour}
            onChange={(hour) => onChange({ ...base, hour })}
            itemHeight={ITEM_HEIGHT}
            height={ITEM_HEIGHT * 3}
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
            itemHeight={ITEM_HEIGHT}
            height={ITEM_HEIGHT * 3}
          />
        </div>
      </div>
    </div>
  );
}
