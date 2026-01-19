# MCP Regex Search Server (Local Tool)

This project implements a **local MCP-style tool server** in **Node.js** that allows an IDE or agent to perform a **regex-based search on text files** and return the **line numbers of matched lines**.

The server communicates over **stdin/stdout**, which is how Model Context Protocol (MCP) tools operate internally.

---

## ✨ Features

- 🔍 Regex-based search on local files
- 📄 Returns **line numbers + matched content**
- 🧰 Tool-style JSON API (`tools/list`, `tools/call`)
- ⚡ Lightweight (no external frameworks)
- 🖥️ Runs locally, IDE/agent friendly

---

## 📂 Project Structure

mcp-regex-server/
├── server.js
├── package.json
├── package-lock.json
├── node_modules/
└── README.md


---

## 🚀 Getting Started

### 1️⃣ Prerequisites

- Node.js v18+ (tested on Node v24)
- macOS / Linux / Windows

---

### 2️⃣ Install Dependencies

```bash
npm install
```
No external dependencies are required beyond Node.js standard libraries.

3️⃣ Start the Server
```bash
node server.js
```
You should see:

### ✅ Regex Tool Server Started
The server now listens for JSON requests on stdin.

#### 🧪 Testing the Server
Create a sample file

``` bash
cat <<EOF > test.txt
Hello world
TODO: fix login bug
Some random text
FIXME: handle null case
Another line
EOF
```
🔹 Test: List Available Tools
```bash
echo '{"method":"tools/list"}' | node server.js
```
Expected Output:
```JSON

{
  "tools": [
    {
      "name": "regex_search",
      "description": "Search a file using regex and return matching lines",
      "inputSchema": {
        "type": "object",
        "properties": {
          "filePath": { "type": "string" },
          "pattern": { "type": "string" }
        },
        "required": ["filePath", "pattern"]
      }
    }
  ]
}
```
🔹 Test: Perform Regex Search
```bash
echo '{
  "method": "tools/call",
  "params": {
    "name": "regex_search",
    "arguments": {
      "filePath": "test.txt",
      "pattern": "TODO|FIXME"
    }
  }
}' | node server.js

```
Expected Output:

``` JSON

{
  "content": [
    {
      "type": "json",
      "json": [
        { "line": 2, "content": "TODO: fix login bug" },
        { "line": 4, "content": "FIXME: handle null case" }
      ]
    }
  ]
}

```
### 🧠 How It Works
* The server reads JSON messages from stdin

* Supports two MCP-style methods:

* tools/list → returns available tools

* tools/call → executes a tool

* he regex_search tool:

* Reads the file line-by-line

* Applies the provided regex

* Returns matched lines with their line numbers

Results are sent back via stdout

🔧 Example Tool Request Format

``` 
{
  "method": "tools/call",
  "params": {
    "name": "regex_search",
    "arguments": {
      "filePath": "example.txt",
      "pattern": "ERROR|WARN"
    }
  }
}

```
### 🧑‍💻 Use Cases
* IDE-integrated search tools

* AI agents performing code analysis

* Static analysis and linting helpers
