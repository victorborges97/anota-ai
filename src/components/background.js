import React from "react";

const Background = ({ children }) => {
    return (
        <div className={`
        h-full
        bg-white dark:bg-[#19191f] transition-all
        `}>
            {children}
        </div>
    )
}

export default Background;