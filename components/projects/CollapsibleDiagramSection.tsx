import React, { useState } from "react";

interface Props {
  title: string;
  children: React.ReactNode;
}

const CollapsibleDiagramSection: React.FC<Props> = ({ title, children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-6">
      <button
        className="w-full text-left px-4 py-3 bg-black border-b border-cyan-400 text-cyan-400 font-bold text-xl rounded-t-xl focus:outline-none flex items-center justify-between"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {title}
        <span className={`ml-2 transition-transform ${open ? "rotate-90" : "rotate-0"}`}>▶</span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ${open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        {open && <div className="p-4 bg-black rounded-b-xl border-b border-cyan-400 animate-fade-in">{children}</div>}
      </div>
    </div>
  );
};

export default CollapsibleDiagramSection;
