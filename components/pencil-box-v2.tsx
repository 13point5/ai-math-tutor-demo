import { CharacterGameState } from "@/app/types";
import { PencilGroupV2 } from "@/components/pencil-group-v2";
import { getColorClasses } from "@/lib/utils";
import Image from "next/image";

interface Props {
  label: string;
  avatarPath: string;
  color: string;
  characterState: CharacterGameState;
  onBoxClick: () => void;
  maxNumOfGroups?: number;
  onDragStart?: () => void;
  onDrop?: () => void;
  canDrag?: boolean;
  canReceiveDrop?: boolean;
}

export function PencilBoxV2({
  label,
  avatarPath,
  color,
  characterState,
  onBoxClick,
  maxNumOfGroups,
  onDragStart,
  onDrop,
  canDrag = false,
  canReceiveDrop = false,
}: Props) {
  const colorClasses = getColorClasses(color);

  const handleDragStart = () => {
    if (!canDrag) return;

    if (onDragStart) onDragStart();
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (canReceiveDrop) {
      e.preventDefault();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!canReceiveDrop) return;

    e.preventDefault();

    if (onDrop) onDrop();
  };

  return (
    <div className="w-full flex flex-col gap-2 items-center justify-center">
      <div className="flex justify-center">
        <div
          className={`${colorClasses.avatarBg} rounded-full p-2 w-20 h-20 flex items-center justify-center`}
        >
          <Image
            src={avatarPath}
            alt={label}
            className="rounded-full"
            width={80}
            height={80}
          />
        </div>
      </div>

      <p
        className={`text-center text-xl font-bold ${colorClasses.nameText} select-none`}
      >
        {label}
      </p>

      <div
        className={`w-full h-[450px] ${colorClasses.boxBorder} ${colorClasses.boxBg} rounded-lg cursor-pointer select-none`}
        onClick={onBoxClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {characterState.numOfGroups > 0
          ? renderPencilGroups({
              numOfPencilsPerGroup: characterState.numOfPencilsPerGroup,
              numOfGroups: characterState.numOfGroups,
              color,
              maxNumOfGroups,
              canDrag,
              onDragStart: handleDragStart,
            })
          : renderPencils(characterState.numOfPencilsPerGroup)}
      </div>
    </div>
  );
}

function renderPencils(count: number) {
  return (
    <div className="w-full h-full grid grid-cols-3 grid-rows-5 place-items-center">
      {Array.from({ length: count }).map((_, index) => (
        <Image
          key={index}
          src="/assets/pencil.png"
          alt="pencil"
          width={35}
          height={35}
        />
      ))}
    </div>
  );
}

function renderPencilGroups({
  numOfPencilsPerGroup,
  numOfGroups,
  color,
  maxNumOfGroups,
  canDrag,
  onDragStart,
}: {
  numOfPencilsPerGroup: number;
  numOfGroups: number;
  color: string;
  maxNumOfGroups?: number;
  canDrag?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}) {
  // Center the single group if maxNumOfGroups is 1 and numOfGroups is 1
  if (maxNumOfGroups === 1 && numOfGroups === 1) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        draggable={canDrag}
        onDragStart={onDragStart}
      >
        <PencilGroupV2 count={numOfPencilsPerGroup} color={color} />
      </div>
    );
  }

  // Default grid layout
  return (
    <div className="w-full h-full grid grid-cols-3 grid-rows-5 place-items-center">
      {Array.from({ length: numOfGroups }).map((_, index) => (
        <div key={index} draggable={canDrag} onDragStart={onDragStart}>
          <PencilGroupV2 count={numOfPencilsPerGroup} color={color} />
        </div>
      ))}
    </div>
  );
}
