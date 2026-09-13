interface Props {
  message: { type: "success" | "error"; text: string } | null;
}

export function TestimonialAlert({ message }: Props) {
  if (!message) return null;
  const isSuccess = message.type === "success";

  return (
    <div
      className={`mb-5 p-3.5 rounded-xl text-xs ${
        isSuccess
          ? "bg-[#eef2ec] border border-[#dbe6d9] text-[#252724]"
          : "bg-rose-50 border border-rose-200 text-rose-700"
      }`}
    >
      {message.text}
    </div>
  );
}
