interface Props {
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function ToolButtonV2({ isSelected, onClick, children }: Props) {
  return (
    <button
      onClick={onClick}
      className={`p-4 w-16 h-16 flex items-center justify-center rounded-xl cursor-pointer transition-all border-4 ${
        isSelected
          ? "border-blue-500 scale-110"
          : "border-neutral-200 hover:border-blue-300"
      }`}
    >
      {children}
    </button>
  );
}
