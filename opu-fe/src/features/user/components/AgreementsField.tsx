"use client";

import Checkbox from "@/components/common/Checkbox";

type Agreements = {
  all: boolean;
  terms: boolean;
  privacy: boolean;
  marketing: boolean;
  notification: boolean;
};

type Props = {
  value: Agreements;
  onChangeAll: (checked: boolean) => void;
  onChangeItem: (key: keyof Agreements, checked: boolean) => void;
  className?: string;
};

export default function AgreementsField({
  value,
  onChangeAll,
  onChangeItem,
  className = "",
}: Props) {
  return (
    <section className={`mt-6 text-sm ${className}`}>
      <label className="flex items-center gap-2">
      <Checkbox checked={value.all} onChange={(checked) => onChangeAll(checked)} size={12}/>
        <p className="text-agreement-required">
        전체 동의
        </p>
      </label>

      <hr className="my-3 border-t border-[var(--color-super-light-gray)]" />

      <div className="mt-2 flex flex-col gap-2">
        <label className="flex items-center gap-2">
          <Checkbox checked={value.terms} onChange={(checked) =>onChangeItem("terms", checked)} size={12}/>
          <p className="text-agreement-required">
          [필수] 이용약관 동의
          </p>
        </label>
        <label className="flex items-center gap-2">
          <Checkbox checked={value.privacy} onChange={(checked) =>onChangeItem("privacy", checked)} size={12}/>
          <p className="text-agreement-required">
          [필수] 개인정보 수집 및 이용 동의
          </p>
        </label>
        <label className="flex items-center gap-2">
          <Checkbox checked={value.marketing} onChange={(checked) =>onChangeItem("marketing", checked)} size={12}/>
          <p className="text-agreement-optional">
          [선택] 마케팅 정보 수신 동의
          </p>
        </label>
        <label className="flex items-center gap-2">
          <Checkbox checked={value.notification} onChange={(checked) =>onChangeItem("notification", checked)} size={12}/>
          <p className="text-agreement-optional">
          [선택] 알림 수신 동의
          </p>
        </label>
      </div>
    </section>
  );
}
