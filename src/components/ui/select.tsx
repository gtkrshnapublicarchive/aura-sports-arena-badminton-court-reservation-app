"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import clsx from "clsx";
import { SelectOption, SelectProps } from "./select.types";

export type { SelectOption, SelectProps };

export function Select({
  label,
  error,
  helperText,
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  disabled = false,
  className,
  id,
  name,
}: SelectProps) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (opt: SelectOption) => {
    if (opt.disabled) return;
    onChange(opt.value);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={clsx("relative w-full text-left", className)}>
      {name && <input type="hidden" name={name} value={value} />}
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-medium text-[#252724] mb-1.5"
        >
          {label}
        </label>
      )}

      <button
        type="button"
        id={selectId}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={clsx(
          "w-full flex items-center justify-between rounded-xl bg-white px-3.5 py-2.5 text-sm text-[#252724] border border-black/10 transition-all text-left cursor-pointer",
          "hover:border-black/20 focus:outline-none focus:ring-2 focus:ring-[#668c63] focus:border-transparent",
          disabled && "bg-neutral-100 cursor-not-allowed opacity-60",
          error && "border-rose-500 focus:ring-rose-500",
          isOpen && "border-[#668c63] ring-2 ring-[#668c63]/20"
        )}
      >
        <span className={clsx("truncate", !selectedOption && "text-neutral-400")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={clsx(
            "h-4 w-4 text-[#737870] transition-transform duration-200 shrink-0 ml-2",
            isOpen && "rotate-180 text-[#252724]"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 top-full mt-1.5 w-full rounded-xl border border-black/8 bg-white p-1.5 shadow-lg shadow-black/5 z-50 max-h-60 overflow-y-auto"
        >
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt)}
                className={clsx(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition cursor-pointer select-none",
                  isSelected
                    ? "bg-[#eef2ec] text-[#252724] font-medium"
                    : "text-[#626760] hover:bg-[#f2f5f0] hover:text-[#20211f]",
                  opt.disabled && "opacity-40 cursor-not-allowed"
                )}
              >
                <div className="truncate">
                  <div>{opt.label}</div>
                  {opt.description && (
                    <div className="text-[11px] text-neutral-400 font-normal">
                      {opt.description}
                    </div>
                  )}
                </div>
                {isSelected && (
                  <span className="text-[#5a8357] font-semibold text-xs ml-2">
                    ✓
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {error ? (
        <p className="mt-1 text-xs text-rose-600">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-neutral-500">{helperText}</p>
      ) : null}
    </div>
  );
}
