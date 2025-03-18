// Add interface for tools
interface Tool {
  type: "function";
  name: string;
  description: string;
  parameters?: Record<string, unknown>;
}

const toolDefinitions = {
  highlightQuestionParts: {
    description:
      "Highlights parts of the question that the student is struggling with. Use this when you want to emphasize certain parts of the question. This can be used when the student is struggling to understand the question.",
    parameters: {
      type: "object",
      properties: {
        strings: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of strings to highlight.",
        },
      },
      required: ["strings"],
    },
  },
} as const;

const tools: Tool[] = Object.entries(toolDefinitions).map(([name, config]) => ({
  type: "function",
  name,
  description: config.description,
  parameters: config.parameters,
})) as Tool[];

export type { Tool };
export { tools };
