"use client";

import WheelPickerBase from "@/components/common/WheelPickerBase";

type Props = {
  items: number[];
  value: number;
  onChange: (v: number) => void;
  height?: number;
  itemHeight?: number;
};

export default function WheelPickerYearMonth({
  items,
  value,
  onChange,
  height,
  itemHeight,
}: Props) {
  return (
    <WheelPickerBase
      items={items}
      value={value}
      onChange={onChange}
      height={height}
      itemHeight={itemHeight}
      isItemDisabled={() => false}
    />
  );
}
