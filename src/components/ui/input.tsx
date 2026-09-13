import React from "react";
import clsx from "clsx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-[#252724] mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            "w-full rounded-xl bg-white px-3.5 py-2.5 text-sm text-[#252724] placeholder:text-neutral-400 border border-black/10 transition-all",
            "focus:outline-none focus:ring-2 focus:ring-[#668c63] focus:border-transparent",
            "disabled:bg-neutral-100 disabled:cursor-not-allowed",
            error && "border-rose-500 focus:ring-rose-500",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="mt-1 text-xs text-rose-600">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-neutral-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
