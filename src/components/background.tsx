import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Background = ({ children, className = "" }: Props) => {
  return (
    <div
      className={`
        h-full
        bg-slate-200 dark:bg-[#19191f] transition-all
        ${className}
        `}
    >
      {children}
    </div>
  );
};

export default Background;
