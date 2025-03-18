import { getColorClasses } from "@/lib/utils";
import Image from "next/image";

interface Props {
  count: number;
  color: string;
}

export function PencilGroupV2({ count, color }: Props) {
  const colorClasses = getColorClasses(color);

  return (
    <div className={`${colorClasses.boxBorder} border-dashed rounded-lg p-2`}>
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex justify-center">
            <Image
              src="/assets/pencil.png"
              alt="pencil"
              width={24}
              height={24}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
