import { type ReactNode, useState } from "react";

type Tab = {
  key: string;
  label: string;
  content: ReactNode;
};

type PreviewTabsProps = {
  tabs: Tab[];
  defaultKey?: string;
};

export function PreviewTabs({ tabs, defaultKey }: PreviewTabsProps) {
  const [active, setActive] = useState(defaultKey ?? tabs[0]?.key ?? "");

  const current = tabs.find((t) => t.key === active);

  return (
    <div className="prv-tabs">
      <div className="prv-tabs-bar" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={tab.key === active}
            className={`prv-tab${tab.key === active ? " prv-tab--active" : ""}`}
            onClick={() => setActive(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="prv-tabs-content">{current?.content}</div>
    </div>
  );
}
