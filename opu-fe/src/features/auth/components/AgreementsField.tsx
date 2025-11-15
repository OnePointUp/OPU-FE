"use client";

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
      
      {/* 전체 동의 */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="custom-checkbox"
          checked={value.all}
          onChange={(e) => onChangeAll(e.target.checked)}
        />
        <p className="text-agreement-required">전체 동의</p>
      </label>

      <hr className="my-3 border-t border-[var(--color-super-light-gray)]" />

      {/* 개별 항목 */}
      <div className="mt-2 flex flex-col gap-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="custom-checkbox"
            checked={value.terms}
            onChange={(e) => onChangeItem("terms", e.target.checked)}
          />
          <p className="text-agreement-required">[필수] 이용약관 동의</p>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="custom-checkbox"
            checked={value.privacy}
            onChange={(e) => onChangeItem("privacy", e.target.checked)}
          />
          <p className="text-agreement-required">[필수] 개인정보 수집 및 이용 동의</p>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="custom-checkbox"
            checked={value.marketing}
            onChange={(e) => onChangeItem("marketing", e.target.checked)}
          />
          <p className="text-agreement-optional">[선택] 마케팅 정보 수신 동의</p>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="custom-checkbox"
            checked={value.notification}
            onChange={(e) => onChangeItem("notification", e.target.checked)}
          />
          <p className="text-agreement-optional">[선택] 알림 수신 동의</p>
        </label>
      </div>

    </section>
  );
}
