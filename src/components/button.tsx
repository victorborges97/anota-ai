import React from "react";

export default function Button(props: any) {
  const { type = "button", children, onClick, className = "" } = props;
  return (
    <button
      className={`
            ${className}
            bg-black hover:bg-black-light 
            text-white font-bold py-2 px-4 rounded 
            focus:outline-none focus:shadow-outline 
            
            `}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
