import { ReactNode } from "react";

interface TwoPanelProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
}

export default function TwoPanel({ leftPanel, rightPanel }: TwoPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-5 max-w-[1200px] mx-auto">
      <div className="panel p-5">
        {leftPanel}
      </div>
      <div className="panel p-5">
        {rightPanel}
      </div>
    </div>
  );
}
