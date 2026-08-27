# Internal Mobility SPA

Internal Mobility SPA is a React-based Single Page Application (SPA) for the Internal Mobility platform.

The application provides an AI-powered chat interface that allows users to ask questions and receive AI-generated responses. It supports conversation threads, message history, real-time streaming responses, Markdown rendering, automatic scrolling, and error handling.

---

# Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Install Dependencies](#install-dependencies)
- [Environment Configuration](#environment-configuration)
- [Run the Application](#run-the-application)
- [Available NPM Scripts](#available-npm-scripts)
- [Project Structure](#project-structure)
- [Application Flow](#application-flow)
- [Chat Page](#chat-page)
- [Thread Management](#thread-management)
- [Message Management](#message-management)
- [Chat API](#chat-api)
- [Streaming Response](#streaming-response)
- [Markdown Support](#markdown-support)
- [Automatic Scrolling](#automatic-scrolling)
- [Loading States](#loading-states)
- [Error Handling](#error-handling)
- [Request Cancellation](#request-cancellation)
- [Keyboard Support](#keyboard-support)
- [CORS Configuration](#cors-configuration)
- [Ngrok Configuration](#ngrok-configuration)
- [ESLint](#eslint)
- [Production Build](#production-build)
- [Production Deployment](#production-deployment)
- [Environment-Specific Configuration](#environment-specific-configuration)
- [Git Configuration](#git-configuration)
- [Troubleshooting](#troubleshooting)
- [Testing Checklist](#testing-checklist)
- [Future Improvements](#future-improvements)
- [License](#license)

---

# Project Overview

The Internal Mobility SPA is a frontend application built with React and TypeScript.

The main purpose of the application is to provide a chat interface through which users can query internal mobility and workforce intelligence information.

The application communicates with a backend API for:

1. Fetching user threads.
2. Fetching messages for a selected thread.
3. Sending user questions.
4. Receiving AI responses through a streaming API.

---

# Features

## Chat

- Send questions to the AI assistant.
- Receive AI responses.
- Real-time streaming response support.
- Send messages using the Send button.
- Send messages using the Enter key.
- Disable input while a response is being generated.

## Threads

- Display available conversation threads.
- Automatically select the first available thread.
- Select different threads from the sidebar.
- Load conversation history for the selected thread.

## Message History

- Display previous user messages.
- Display previous assistant messages.
- Preserve conversation history by thread.

## Streaming

- Read streaming responses using the browser Fetch API.
- Process streaming chunks progressively.
- Update the assistant message while the response is being generated.
- Support SSE-style `data:` responses.
- Support JSON responses.
- Support plain text responses.

## Markdown

Assistant responses support:

- Headings
- Paragraphs
- Bold
- Italic
- Lists
- Ordered lists
- Code blocks
- Inline code
- Tables
- GitHub-flavored Markdown

## Automatic Scrolling

The chat automatically scrolls to the latest message when:

- A new user message is sent.
- An assistant response starts.
- Streaming chunks arrive.
- Messages are loaded.
- A response finishes.
- An error is displayed.

## Error Handling

The application handles:

- API errors.
- Network errors.
- Invalid JSON.
- Empty responses.
- Streaming errors.
- Failed thread requests.
- Failed message requests.
- Request cancellation.

---

# Technology Stack

| Technology | Purpose |
|---|---|
| React | UI library |
| TypeScript | Type-safe JavaScript |
| Vite | Development server and build tool |
| React Router | Application routing |
| Tailwind CSS | UI styling |
| React Markdown | Markdown rendering |
| remark-gfm | GitHub-flavored Markdown |
| Fetch API | Backend API communication |
| ReadableStream | Streaming API responses |
| AbortController | Request cancellation |
| ESLint | Code quality |

---

# System Architecture

```text
                    +----------------------+
                    |        User          |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    |    React SPA         |
                    |                      |
                    |  Internal Mobility   |
                    |       Chat           |
                    +----------+-----------+
                               |
                               |
                    HTTP / Streaming API
                               |
                               v
                    +----------------------+
                    |     Backend API      |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    | AI / Intelligence    |
                    |      Service         |
                    +----------------------+
```

---

# Prerequisites

Before running the project, make sure the following software is installed.

## Node.js

Node.js version 18 or later is recommended.

Check the installed version:

```bash
node --version
```

Example:

```text
v20.19.0
```

## npm

Check npm:

```bash
npm --version
```

Example:

```text
10.x.x
```

If Node.js is not installed, install it from the official Node.js website.

---

# Project Setup

## 1. Clone the Repository

Clone the repository:

```bash
git clone <repository-url>
```

Example:

```bash
git clone https://github.com/<organization>/internal-mobility-spa.git
```

---

## 2. Navigate to the Project

```bash
cd internal-mobility-spa
```

---

# Install Dependencies

Install all project dependencies:

```bash
npm install
```

This installs the dependencies defined in:

```text
package.json
```

and creates:

```text
node_modules/
```

---

# Environment Configuration

The application uses Vite environment variables.

Create a file named:

```text
.env
```

in the root directory of the project.

The structure should be:

```text
internal-mobility-spa/
│
├── .env
├── package.json
├── vite.config.ts
└── src/
```

---

## Environment Variable

Add the backend API URL:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

For example, when using the current development Ngrok API:

```env
VITE_API_BASE_URL=https://df21-2401-4900-8821-5ebb-b4a7-3355-d29d-625.ngrok-free.app/api
```

---

# Using the API URL in React

Do not hardcode the API URL inside the React component.

Avoid:

```ts
const API_BASE =
    'https://example.ngrok-free.app/api'
```

Use:

```ts
const API_BASE =
    import.meta.env.VITE_API_BASE_URL
```

This allows the same application to work with different environments.

---

# Environment File Example

Complete `.env` example:

```env
VITE_API_BASE_URL=https://df21-2401-4900-8821-5ebb-b4a7-3355-d29d-625.ngrok-free.app/api
```

---

# Important Environment Variable Rule

Vite exposes frontend environment variables to the browser.

Therefore, only public configuration should be stored in:

```text
VITE_*
```

Do NOT store secrets such as:

```text
Database passwords
AWS secret keys
Private API keys
JWT secrets
OAuth client secrets
```

inside frontend environment variables.

---

# Run the Application

After installing dependencies and configuring `.env`, start the development server:

```bash
npm run dev
```

Vite will start the application.

You should see something similar to:

```text
VITE vX.X.X ready in XXX ms

➜ Local: http://localhost:5173/
```

Open the displayed URL in your browser.

Usually:

```text
http://localhost:5173
```

---

# Development Server

The development server provides:

- Hot Module Replacement (HMR).
- Fast development builds.
- Automatic browser refresh.
- TypeScript/Vite compilation.
- ESLint integration depending on project configuration.

When you modify a source file, Vite automatically updates the application.

---

# Available NPM Scripts

The available scripts can be checked using:

```bash
npm run
```

Common scripts are described below.

---

## Start Development Server

```bash
npm run dev
```

Starts the application in development mode.

---

## Build Application

```bash
npm run build
```

Creates an optimized production build.

The output is generated inside:

```text
dist/
```

---

## Preview Production Build

```bash
npm run preview
```

Starts a local server using the generated production build.

---

## Run ESLint

```bash
npm run lint
```

Checks the source code for ESLint issues.

---

## Automatically Fix ESLint Issues

```bash
npm run lint -- --fix
```

This fixes automatically fixable ESLint issues.

Not every ESLint issue can be fixed automatically.

---

# Project Structure

The project follows a standard React/Vite structure.

```text
internal-mobility-spa/
│
├── public/
│   └── ...
│
├── src/
│   │
│   ├── assets/
│   │   └── ...
│   │
│   ├── components/
│   │   │
│   │   └── Markdown/
│   │       └── MarkdownContent.css
│   │
│   ├── pages/
│   │   │
│   │   └── Chat/
│   │       └── index.tsx
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
│
├── .env
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# Important Files

## `src/pages/Chat/index.tsx`

Main Chat page.

Responsible for:

- Loading threads.
- Selecting threads.
- Loading messages.
- Sending chat requests.
- Processing streaming responses.
- Rendering Markdown.
- Automatic scrolling.
- Loading states.
- Error handling.
- Request cancellation.

---

## `src/components/Markdown/MarkdownContent.css`

Contains styles used for Markdown content.

---

## `src/App.tsx`

Main application component and route configuration.

---

## `src/main.tsx`

Application entry point.

---

## `vite.config.ts`

Vite configuration.

---

## `package.json`

Contains:

- Project metadata.
- Dependencies.
- Development dependencies.
- NPM scripts.

---

# Application Flow

When the application starts:

```text
User opens SPA
       |
       v
Application loads
       |
       v
User information is obtained
       |
       v
Load available threads
       |
       v
Select first thread
       |
       v
Load thread messages
       |
       v
Display conversation
       |
       v
User enters question
       |
       v
Click Send
       |
       v
Add user message
       |
       v
Call /chat API
       |
       v
Receive streaming response
       |
       v
Update assistant message
       |
       v
Scroll to latest message
```

---

# Chat Page

The Chat page contains two main sections.

```text
+-------------------+--------------------------------------+
|                   |                                      |
|     Threads       |             Chat Header              |
|                   |                                      |
|     Sidebar       +--------------------------------------+
|                   |                                      |
|                   |             Messages                 |
|                   |                                      |
|                   |                                      |
|                   +--------------------------------------+
|                   | Message input              [Send]    |
+-------------------+--------------------------------------+
```

---

# Thread Management

Threads are displayed in the left sidebar.

The thread model is:

```ts
interface Thread {
    thread_id: string
    last_updated: string
}
```

Example:

```json
{
    "thread_id": "Thu-27-Aug-2026-shailendra",
    "last_updated": "2026-08-27T08:30:00.000Z"
}
```

---

# Loading Threads

The frontend calls:

```http
GET /threads?user_id={username}
```

Example:

```http
GET /threads?user_id=shailendra
```

The returned threads are displayed in the sidebar.

---

# Selecting a Thread

When the user selects a thread:

```text
User clicks thread
       |
       v
Clear current messages
       |
       v
Set selected thread
       |
       v
Fetch thread messages
       |
       v
Display messages
       |
       v
Scroll to latest message
```

---

# Thread ID

When no existing thread is available, the application can create a thread ID using:

```text
Day-Date-Month-Year-Username
```

Example:

```text
Thu-27-Aug-2026-shailendra
```

---

# Message Management

Messages use the following structure:

```ts
interface Message {
    role: string
    content: string
}
```

Example user message:

```json
{
    "role": "user",
    "content": "Show me the best React developers"
}
```

Example assistant message:

```json
{
    "role": "assistant",
    "content": "Here are the best React developers..."
}
```

---

# Supported Message Roles

User messages can have:

```text
user
human
```

Assistant messages use:

```text
assistant
```

---

# Chat API

The frontend communicates with three primary endpoints.

| Operation | HTTP Method | Endpoint |
|---|---|---|
| Get threads | GET | `/threads?user_id={user_id}` |
| Get messages | GET | `/threads/{thread_id}/messages` |
| Send chat | POST | `/chat?user_id={user_id}&thread_id={thread_id}&query={query}` |

---

# API 1: Get Threads

## Endpoint

```http
GET /threads
```

## Query Parameter

```text
user_id
```

## Example

```http
GET /threads?user_id=shailendra
```

Full URL:

```text
{VITE_API_BASE_URL}/threads?user_id=shailendra
```

---

## Response

Example:

```json
[
    {
        "thread_id": "Thu-27-Aug-2026-shailendra",
        "last_updated": "2026-08-27T08:30:00.000Z"
    },
    {
        "thread_id": "Wed-26-Aug-2026-shailendra",
        "last_updated": "2026-08-26T15:30:00.000Z"
    }
]
```

---

# API 2: Get Messages

## Endpoint

```http
GET /threads/{thread_id}/messages
```

Example:

```http
GET /threads/Thu-27-Aug-2026-shailendra/messages
```

Full URL:

```text
{VITE_API_BASE_URL}/threads/{thread_id}/messages
```

---

# Messages Response

The API can return messages in two supported formats.

## Format 1

```json
[
    {
        "role": "user",
        "content": "Show me React developers"
    },
    {
        "role": "assistant",
        "content": "Here are the React developers..."
    }
]
```

## Format 2

```json
{
    "messages": [
        {
            "role": "user",
            "content": "Show me React developers"
        },
        {
            "role": "assistant",
            "content": "Here are the React developers..."
        }
    ]
}
```

The frontend handles both formats.

---

# API 3: Send Chat Message

## Endpoint

```http
POST /chat
```

The request uses the following query parameters:

```text
user_id
thread_id
query
```

Example:

```http
POST /chat?user_id=shailendra&thread_id=Thu-27-Aug-2026-shailendra&query=Show%20me%20the%20best%20React%20developers
```

---

# Chat Request Flow

When the user sends a message:

```text
User enters question
        |
        v
Validate input
        |
        v
Add user message immediately
        |
        v
Add empty assistant message
        |
        v
Scroll to bottom
        |
        v
POST /chat
        |
        v
Read streaming response
        |
        v
Process response chunk
        |
        v
Update assistant message
        |
        v
Scroll to bottom
        |
        v
Response complete
```

---

# HTTP Headers

The frontend sends:

```http
Accept: application/json
Content-Type: application/json
ngrok-skip-browser-warning: 1
```

The `ngrok-skip-browser-warning` header is used during development when the backend is exposed through Ngrok.

---

# Streaming Response

The `/chat` endpoint supports streaming responses.

The frontend reads the response using the browser's `ReadableStream` API.

Example:

```ts
const reader =
    response.body.getReader()
```

A `TextDecoder` is used to convert binary chunks into text:

```ts
const decoder =
    new TextDecoder('utf-8')
```

---

# Supported Streaming Formats

The frontend can handle multiple response formats.

## SSE JSON

Example:

```text
data: {"answer":"Hello"}

data: {"answer":" How"}

data: {"answer":" can"}

data: {"answer":" I help you?"}

data: [DONE]
```

---

## Content Format

The backend may send:

```text
data: {"content":"Hello"}
```

---

## Token Format

The backend may send:

```text
data: {"token":"Hello"}
```

---

## Plain Text

The backend may also return plain text chunks:

```text
Hello
```

---

# Streaming Processing

The frontend processes the stream as follows:

```text
HTTP Response
      |
      v
ReadableStream
      |
      v
TextDecoder
      |
      v
Streaming Buffer
      |
      v
SSE / JSON parsing
      |
      v
Extract answer/content/token
      |
      v
Append to assistant response
      |
      v
Update React state
      |
      v
Render Markdown
```

---

# Important Streaming Behavior

Network chunks do not necessarily correspond to complete messages.

For example, a JSON response could be split across chunks:

### Chunk 1

```text
data: {"answer":"Hel
```

### Chunk 2

```text
lo world"}
```

Therefore, the frontend should buffer incomplete data and process complete SSE messages.

This prevents JSON parsing errors during streaming.

---

# Markdown Support

Assistant responses are rendered using:

```tsx
<ReactMarkdown
    remarkPlugins={[remarkGfm]}
>
    {message.content}
</ReactMarkdown>
```

The following packages are required:

```bash
npm install react-markdown remark-gfm
```

---

# Markdown Examples

## Heading

```markdown
## Best Candidates
```

## Bold

```markdown
**Important**
```

## Italic

```markdown
*Important*
```

## List

```markdown
- React
- Node.js
- MongoDB
```

## Ordered List

```markdown
1. React
2. Node.js
3. MongoDB
```

## Code

````markdown
```javascript
const message = "Hello"
console.log(message)
```