"use client";

import { GameState, GameTool } from "@/app/types";
import { HighlightedQuestion } from "@/components/highlighted-question";
import { PencilBoxV2 } from "@/components/pencil-box-v2";
import { ToolButtonV2 } from "@/components/tool-button-v2";
import { Button } from "@/components/ui/button";
// import { ConversationPanel } from "@/components/conversation-panel";
import useWebRTCAudioSession from "@/hooks/use-webrtc";
import { question } from "@/lib/constants";
import { tools } from "@/lib/tools";
import { PlayCircle } from "lucide-react";
import { StopCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PencilMathGame() {
  const [gameState, setGameState] = useState<GameState>({
    max: {
      numOfPencilsPerGroup: 0,
      numOfGroups: 0,
    },
    lena: {
      numOfPencilsPerGroup: 0,
      numOfGroups: 0,
    },
    activeTool: GameTool.PENCIL,
    highlightQuestionParts: [],
  });

  const handleHighlightQuestion = ({ strings }: { strings: string[] }) => {
    console.log("strings", strings);
    setGameState((prev) => ({
      ...prev,
      highlightQuestionParts: strings,
    }));
    return "Highlighted the text";
  };

  const {
    isSessionActive,
    registerFunction,
    handleStartStopClick,
    updateGameState,
    msgs,
    conversation,
  } = useWebRTCAudioSession("ash", question, tools);

  // const conversation = [
  //   {
  //     id: "1",
  //     role: "user",
  //     text: "Hello, how are you?",
  //     timestamp: "2021-01-01T00:00:00.000Z",
  //     isFinal: false,
  //     status: "processing",
  //   },
  //   {
  //     id: "2",
  //     role: "assistant",
  //     text: "I'm good, thank you!",
  //     timestamp: "2021-01-01T00:00:00.000Z",
  //     isFinal: true,
  //     status: "final",
  //   },
  // ];

  console.log({ msgs, conversation });

  useEffect(() => {
    registerFunction("highlightQuestionParts", handleHighlightQuestion);
  }, [registerFunction]);

  useEffect(() => {
    updateGameState(gameState);
  }, [gameState]);

  const handleAddPencil = (character: "max" | "lena") => {
    setGameState((prev) => ({
      ...prev,
      [character]: {
        ...prev[character],
        numOfPencilsPerGroup: prev[character].numOfPencilsPerGroup + 1,
      },
    }));
  };

  const handleRemovePencil = (character: "max" | "lena") => {
    setGameState((prev) => ({
      ...prev,
      [character]: {
        ...prev[character],
        numOfPencilsPerGroup: Math.max(
          0,
          prev[character].numOfPencilsPerGroup - 1
        ),
      },
    }));
  };

  const handleMaxBoxClick = () => {
    if (gameState.activeTool === GameTool.PENCIL) {
      handleAddPencil("max");
    } else if (gameState.activeTool === GameTool.ERASER) {
      handleRemovePencil("max");
    } else if (gameState.activeTool === GameTool.GROUP) {
      setGameState((prev) => ({
        ...prev,
        max: {
          ...prev.max,
          numOfGroups: 1,
        },
      }));
    } else if (gameState.activeTool === GameTool.UNGROUP) {
      setGameState((prev) => ({
        ...prev,
        max: {
          ...prev.max,
          numOfGroups: 0,
        },
        lena: {
          numOfPencilsPerGroup: 0,
          numOfGroups: 0,
        },
      }));
    }
  };

  const handleLenaBoxClick = () => {
    if (
      gameState.activeTool === GameTool.UNGROUP &&
      gameState.lena.numOfGroups > 0
    ) {
      setGameState((prev) => ({
        ...prev,
        lena: {
          ...prev.lena,
          numOfGroups: Math.max(0, prev.lena.numOfGroups - 1),
        },
      }));
    }
  };

  const handleGroupDrop = () => {
    // When a group is dropped from Max to Lena
    setGameState((prev) => ({
      ...prev,
      lena: {
        numOfPencilsPerGroup: prev.max.numOfPencilsPerGroup,
        numOfGroups: prev.lena.numOfGroups + 1,
      },
    }));
  };

  // Check if Max's box has exactly one group and the group tool is active
  const canDragFromMax =
    gameState.max.numOfGroups === 1 && gameState.activeTool === GameTool.GROUP;

  // Lena's box can receive a drop when the group tool is active
  const canDropToLena = gameState.activeTool === GameTool.GROUP;

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start justify-center p-4 md:p-8 max-w-[1400px] h-full mx-auto">
      {/* Main Game Area */}
      <div className="flex flex-col gap-6 items-center flex-1">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">AI Math Tutor</h1>
          <p className="text-lg text-neutral-500">Multiplicative Comparison</p>

          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
            onClick={handleStartStopClick}
          >
            {isSessionActive ? (
              <>
                <StopCircle className="w-6 h-6" />
                <span>Stop Session</span>
              </>
            ) : (
              <>
                <PlayCircle className="w-6 h-6" />
                <span>Start Session</span>
              </>
            )}
          </Button>
        </div>

        <HighlightedQuestion
          text={question}
          segments={gameState.highlightQuestionParts}
        />

        <div className="w-full max-w-3xl">
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <PencilBoxV2
              label="Max"
              avatarPath="/assets/boy.png"
              color="blue"
              characterState={gameState.max}
              onBoxClick={handleMaxBoxClick}
              maxNumOfGroups={1}
              canDrag={canDragFromMax}
            />

            <PencilBoxV2
              label="Lena"
              avatarPath="/assets/girl.png"
              color="pink"
              characterState={gameState.lena}
              onBoxClick={handleLenaBoxClick}
              canReceiveDrop={canDropToLena}
              onDrop={handleGroupDrop}
            />
          </div>
        </div>

        {/* Tool Buttons */}
        <div className="flex gap-2 mt-2">
          <ToolButtonV2
            isSelected={gameState.activeTool === GameTool.PENCIL}
            onClick={() =>
              setGameState({ ...gameState, activeTool: GameTool.PENCIL })
            }
          >
            <Image
              src="/assets/pencil.png"
              alt="Pencil"
              width={24}
              height={24}
            />
          </ToolButtonV2>

          <ToolButtonV2
            isSelected={gameState.activeTool === GameTool.ERASER}
            onClick={() =>
              setGameState({ ...gameState, activeTool: GameTool.ERASER })
            }
          >
            <Image
              src="/assets/eraser.png"
              alt="Eraser"
              width={24}
              height={24}
            />
          </ToolButtonV2>

          <ToolButtonV2
            isSelected={gameState.activeTool === GameTool.GROUP}
            onClick={() =>
              setGameState({ ...gameState, activeTool: GameTool.GROUP })
            }
          >
            <Image src="/assets/group.png" alt="Group" width={32} height={32} />
          </ToolButtonV2>

          <ToolButtonV2
            isSelected={gameState.activeTool === GameTool.UNGROUP}
            onClick={() =>
              setGameState({ ...gameState, activeTool: GameTool.UNGROUP })
            }
          >
            <Image
              src="/assets/ungroup.png"
              alt="Ungroup"
              width={32}
              height={32}
            />
          </ToolButtonV2>
        </div>
      </div>

      {/* Conversation Panel */}
      {/* <div className="w-full h-full md:w-auto">
        <ConversationPanel conversation={conversation} />
      </div> */}
    </div>
  );
}
