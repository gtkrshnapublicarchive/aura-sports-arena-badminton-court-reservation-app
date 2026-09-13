"use client";

import React, { useState } from "react";
import clsx from "clsx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, type, ...props }, ref) => {
    const inputId = id || props.name;
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = useState(false);

    const effectiveType = isPassword ? (showPassword ? "text" : "password") : type;

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
        <div className="relative w-full">
          <input
            ref={ref}
            id={inputId}
            type={effectiveType}
            className={clsx(
              "w-full rounded-xl bg-white px-3.5 py-2.5 text-sm text-[#252724] placeholder:text-neutral-400 border border-black/10 transition-all",
              "focus:outline-none focus:ring-2 focus:ring-[#668c63] focus:border-transparent",
              "disabled:bg-neutral-100 disabled:cursor-not-allowed",
              isPassword && "pr-10",
              error && "border-rose-500 focus:ring-rose-500",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-[#252724] cursor-pointer transition-colors focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
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
