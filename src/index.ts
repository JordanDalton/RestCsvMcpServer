import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from 'axios';

// Create an MCP server
const server = new McpServer({
  name: "RestCSV",
  version: "1.0.0"
});

const BASE_URL = "https://restcsv.com/api";

// Function to get the API key from environment variables
function getApiKey(): string {
  const apiKey = process.env.RESTCSV_API_KEY;
  if (!apiKey) {
    throw new Error("RESTCSV_API_KEY environment variable not set.");
  }
  return apiKey;
}

// Create an Axios instance with default headers
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getApiKey()}`
  }
});

// Tool: List Actions
server.tool("list_actions",
  {},
  async () => {
    try {
      const response = await api.get("/actions");
      return {
        content: [{ type: "text", text: String(JSON.stringify(response.data)) }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// Tool: Create Action
server.tool("create_action",
  {
    prompt: z.string().describe("Example: Split name field into first and last name"),
    applies_to: z.array(z.string()).describe("The UUID of the CSV or CsvRow object(s) this action applies to.")
  },
  async ({ prompt, applies_to }) => {
    try {
      const response = await api.post("/actions", { prompt, applies_to });
      return {
        content: [{ type: "text", text: String(JSON.stringify(response.data)) }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// Tool: Show Action
server.tool("show_action",
  {
    action: z.string().uuid().describe("The UUID of the Action object.")
  },
  async ({ action }) => {
    try {
      const response = await api.get(`/actions/${action}`);
      return {
        content: [{ type: "text", text: String(JSON.stringify(response.data)) }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// Tool: Update Action
server.tool("update_action",
  {
    action: z.string().uuid().describe("The action UUID"),
    prompt: z.string().describe("Example: Split name field into first and last name"),
    applies_to: z.array(z.string()).describe("The UUID of the CSV or CsvRow object(s) this action applies to.")
  },
  async ({ action, prompt, applies_to }) => {
    try {
      const response = await api.put(`/actions/${action}`, { prompt, applies_to });
      return {
        content: [{ type: "text", text: String(JSON.stringify(response.data)) }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// Tool: Delete Action
server.tool("delete_action",
  {
    action: z.string().uuid().describe("The action UUID")
  },
  async ({ action }) => {
    try {
      const response = await api.delete(`/actions/${action}`);
      return {
        content: [{ type: "text", text: String(JSON.stringify(response.data)) }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// Tool: Execute Action
server.tool("execute_action",
  {
    action: z.string().uuid().describe("The action UUID"),
    csvs: z.array(z.string()).optional(),
    rows: z.array(z.string()).optional()
  },
  async ({ action, csvs, rows }) => {
    try {
      const response = await api.post(`/actions/${action}/execute`, { csvs, rows });
      return {
        content: [{ type: "text", text: String(JSON.stringify(response.data)) }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// Tool: List CSVs
server.tool("list_csvs",
  {},
  async () => {
    try {
      const response = await api.get("/csvs");
      return {
        content: [{ type: "text", text: String(JSON.stringify(response.data)) }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// Tool: Store CSV
server.tool("store_csv",
  {
    csv: z.string().describe("The CSV data")
  },
  async ({ csv }) => {
    try {
      const response = await api.post("/csvs", { csv });
      return {
        content: [{ type: "text", text: String(JSON.stringify(response.data)) }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// Tool: Show CSV
server.tool("show_csv",
  {
    csv: z.string().uuid().describe("The csv UUID")
  },
  async ({ csv }) => {
    try {
      const response = await api.get(`/csvs/${csv}`);
      return {
        content: [{ type: "text", text: String(JSON.stringify(response.data)) }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// Tool: Delete CSV
server.tool("delete_csv",
  {
    csv: z.string().uuid().describe("The csv UUID")
  },
  async ({ csv }) => {
    try {
      const response = await api.delete(`/csvs/${csv}`);
      return {
        content: [{ type: "text", text: String(JSON.stringify(response.data)) }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// Tool: List CSV Rows
server.tool("list_csv_rows",
  {
    csv: z.string().uuid().describe("The csv UUID")
  },
  async ({ csv }) => {
    try {
      const response = await api.get(`/csvs/${csv}/rows`);
      return {
        content: [{ type: "text", text: String(JSON.stringify(response.data)) }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// Tool: Store CSV Row
server.tool("store_csv_row",
  {
    csv: z.string().uuid().describe("The csv UUID"),
    meta: z.array(z.any()).describe("Typically key/value pairs, but can also be nested json.")
  },
  async ({ csv, meta }) => {
    try {
      const response = await api.post(`/csvs/${csv}/rows`, { meta });
      return {
        content: [{ type: "text", text: String(JSON.stringify(response.data)) }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// Tool: Show CSV Row
server.tool("show_csv_row",
  {
    csv: z.string().uuid().describe("The csv UUID"),
    row: z.string().uuid().describe("The row UUID").nullable()
  },
  async ({ csv, row }) => {
    try {
      const response = await api.get(`/csvs/${csv}/rows/${row}`);
      return {
        content: [{ type: "text", text: String(JSON.stringify(response.data)) }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// Tool: Update CSV Row
server.tool("update_csv_row",
  {
    csv: z.string().uuid().describe("The csv UUID"),
    row: z.string().uuid().describe("The row UUID").nullable(),
    meta: z.array(z.any()).describe("Typically key/value pairs, but can also be nested json.")
  },
  async ({ csv, row, meta }) => {
    try {
      const response = await api.put(`/csvs/${csv}/rows/${row}`, { meta });
      return {
        content: [{ type: "text", text: String(JSON.stringify(response.data)) }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// Tool: Remove CSV Row
server.tool("remove_csv_row",
  {
    csv: z.string().uuid().describe("The csv UUID"),
    row: z.string().uuid().describe("The row UUID").nullable()
  },
  async ({ csv, row }) => {
    try {
      const response = await api.delete(`/csvs/${csv}/rows/${row}`);
      return {
        content: [{ type: "text", text: String(JSON.stringify(response.data)) }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// Tool: Bulk Store CSV Row
server.tool("bulk_store_csv_row",
  {
    csv: z.string().uuid().describe("The csv UUID"),
    metas: z.array(z.array(z.any())).describe("Typically key/value pairs, but can also be nested json.")
  },
  async ({ csv, metas }) => {
    try {
      const response = await api.post(`/csvs/${csv}/rows/bulk`, { metas });
      return {
        content: [{ type: "text", text: String(JSON.stringify(response.data)) }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// Tool: Search Single CSV
server.tool("search_single_csv",
  {
    csv: z.string().uuid().describe("The csv UUID"),
    searchable: z.string().optional(),
    term: z.string().optional(),
    per_page: z.string().optional()
  },
  async ({ csv, searchable, term, per_page }) => {
    try {
      const response = await api.get(`/csvs/${csv}/search?searchable=${searchable}&term=${term}&perPage=${per_page}`);
      return {
        content: [{ type: "text", text: String(JSON.stringify(response.data)) }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// Tool: List Webhooks
server.tool("list_webhooks",
  {},
  async () => {
    try {
      const response = await api.get("/webhooks");
      return {
        content: [{ type: "text", text: String(JSON.stringify(response.data)) }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// Tool: Store Webhook
server.tool("store_webhook",
  {
    verb: z.string().describe("The HTTP verb"),
    endpoint: z.string().describe("The webhook endpoint"),
    headers: z.array(z.any()).optional().describe("Any headers that need to be included."),
    mappings: z.array(z.any()).describe("The webhook mapping. The key is the CSV column name and the value is the mapping to the payload receiving this webhook.")
  },
  async ({ verb, endpoint, headers, mappings }) => {
    try {
      const response = await api.post("/webhooks", { verb, endpoint, headers, mappings });
      return {
        content: [{ type: "text", text: String(JSON.stringify(response.data)) }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// Tool: Show Webhook
server.tool("show_webhook",
  {
    webhook: z.string().uuid().describe("The webhook UUID")
  },
  async ({ webhook }) => {
    try {
      const response = await api.get(`/webhooks/${webhook}`);
      return {
        content: [{ type: "text", text: String(JSON.stringify(response.data)) }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// Tool: Update Webhook
server.tool("update_webhook",
  {
    webhook: z.string().uuid().describe("The webhook UUID"),
    verb: z.string().describe("The HTTP verb"),
    endpoint: z.string().describe("The webhook endpoint"),
    headers: z.array(z.any()).optional().describe("Any headers that need to be included."),
    mappings: z.array(z.any()).describe("The webhook mapping.")
  },
  async ({ webhook, verb, endpoint, headers, mappings }) => {
    try {
      const response = await api.put(`/webhooks/${webhook}`, { verb, endpoint, headers, mappings });
      return {
        content: [{ type: "text", text: String(JSON.stringify(response.data)) }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// Tool: Delete Webhook
server.tool("delete_webhook",
  {
    webhook: z.string().uuid().describe("The webhook UUID")
  },
  async ({ webhook }) => {
    try {
      const response = await api.delete(`/webhooks/${webhook}`);
      return {
        content: [{ type: "text", text: String(JSON.stringify(response.data)) }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// Tool: Test Webhook
server.tool("test_webhook",
  {
    webhook: z.string().uuid().describe("The webhook UUID")
  },
  async ({ webhook }) => {
    try {
      const response = await api.post(`/webhooks/${webhook}/test`);
      return {
        content: [{ type: "text", text: String(JSON.stringify(response.data)) }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// Tool: CSV Row Webhook Log
server.tool("csv_row_webhook_log",
  {
    webhook: z.string().uuid().describe("The webhook UUID"),
    latest: z.boolean().optional(),
    per_page: z.number().int().optional().default(25)
  },
  async ({ webhook, latest, per_page }) => {
    try {
      const response = await api.get(`/webhooks/${webhook}/logs`, {
        params: { latest, per_page }
      });
      return {
        content: [{ type: "text", text: String(JSON.stringify(response.data)) }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }]
      };
    }
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);