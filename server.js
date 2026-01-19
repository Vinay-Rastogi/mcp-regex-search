import fs from "fs";
import readline from "readline";

process.stdin.setEncoding("utf8");

console.error("✅ Regex Tool Server Started");

process.stdin.on("data", async (data) => {
  try {
    const msg = JSON.parse(data);

    // Simulate MCP tools/list
    if (msg.method === "tools/list") {
      process.stdout.write(
        JSON.stringify({
          tools: [
            {
              name: "regex_search",
              description: "Search a file using regex and return matching lines",
              inputSchema: {
                type: "object",
                properties: {
                  filePath: { type: "string" },
                  pattern: { type: "string" }
                },
                required: ["filePath", "pattern"]
              }
            }
          ]
        }) + "\n"
      );
    }

    // Simulate MCP tools/call
    if (msg.method === "tools/call") {
      const { filePath, pattern } = msg.params.arguments;
      const regex = new RegExp(pattern);
      const results = [];

      const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity
      });

      let line = 0;
      for await (const text of rl) {
        line++;
        if (regex.test(text)) {
          results.push({ line, content: text.trim() });
        }
      }

      process.stdout.write(
        JSON.stringify({
          content: [{ type: "json", json: results }]
        }) + "\n"
      );
    }
  } catch (e) {
    console.error("Error:", e.message);
  }
});
