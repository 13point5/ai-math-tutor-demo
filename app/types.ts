export interface CharacterGameState {
  numOfPencilsPerGroup: number;
  numOfGroups: number;
}

export enum GameTool {
  PENCIL = "pencil",
  ERASER = "eraser",
  GROUP = "group",
  UNGROUP = "ungroup",
}

export interface GameState {
  max: CharacterGameState;
  lena: CharacterGameState;
  activeTool: GameTool;
  highlightQuestionParts: string[];
}
