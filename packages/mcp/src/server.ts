import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { client } from "./client";

import {
  rememberTool,
} from "./tools/remember";

import {
  searchTool,
} from "./tools/search";

import { recallTool } from "./tools/recall";

import { graphTool } from "./tools/graph";

export const server = new McpServer({
  name: "persista",
  version: "1.0.0",
});

server.registerTool(
  searchTool.name,
  {
    description: searchTool.description,
    inputSchema: searchTool.schema,
  },
  searchTool.handler,
);

server.registerTool(
  rememberTool.name,
  {
    description: rememberTool.description,
    inputSchema: rememberTool.schema,
  },
  rememberTool.handler,
);

server.registerTool(
  recallTool.name,
  {
    description: recallTool.description,
    inputSchema: recallTool.schema,
  },
  recallTool.handler,
);

server.registerTool(
  graphTool.name,
  {
    description: graphTool.description,
    inputSchema: graphTool.schema,
  },
  graphTool.handler,
);