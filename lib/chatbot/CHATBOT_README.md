# ChatWidget System Documentation

## 1. Architecture Overview

The ChatWidget system is designed as a standalone, client-side React component enhanced with a robust logic layer (`useChatLogic`) and a simulated persistent storage manager (`ChatHistoryManager`).

### Core Components
- **`ChatWidget.tsx`**: The UI presentation layer handling animations, input, and rendering.
- **`useChatLogic.ts`**: A custom hook managing state, message processing, and integration with the knowledge base.
- **`knowledge-base.ts`**: Contains the `KNOWLEDGE_BASE` (intents), `ChatHistoryManager` (logging), and type definitions.

---

## 2. Question Handling System

### Validation Layer
- **Input Sanitization**: All inputs are trimmed and validated before processing.
- **Catch-All Strategy**: If no intent matches the user's query, the system logs the query as `unanswered` and triggers a fallback response offering direct email contact. This ensures 100% response coverage.
- **Logging**: Every query is logged with a unique ID, timestamp, and status (`answered` | `unanswered`) into `localStorage` via `ChatHistoryManager`.

### Local Database (Session Log)
- **Persistence**: Logs are stored in browser `localStorage` under `chat_session_logs`.
- **Structure**:
  ```typescript
  interface QueryLog {
      id: string;
      timestamp: number;
      query: string;
      status: 'answered' | 'unanswered';
      feedback?: 'positive' | 'negative';
  }
  ```

---

## 3. Response Quality Assurance

### Accuracy Verification
- **Scoring Algorithm**: The system uses a keyword scoring mechanism. It checks for exact matches first, then calculates a score based on keyword frequency in the user's input. The highest-scoring entry is selected.
- **Feedback Loop**: Users can rate bot responses with Thumbs Up/Down. This feedback is linked to the specific query log entry, allowing for future analysis of bot performance.
- **Escalation**: Ambiguous or unhandled queries automatically offer an "Escalation Protocol" (Send Email button).

---

## 4. UI Component Specifications

### Welcome Popup
- **Behavior**: Appears automatically 1.5 seconds after page load.
- **Auto-Dismiss**: Disappears if the user opens the chat or after 8 seconds of inactivity.
- **Animation**: Uses `framer-motion` for smooth entrance/exit (slide up + fade).

### Dynamic Icon
- **Shape Morphing**: On every page load, the chat FAB (Floating Action Button) randomly selects a shape: `Circle`, `Square`, or `Hexagon`.
- **Styling**: Uses CSS `clip-path` for complex shapes (Hexagon) and `border-radius` for others.

---

## 5. Testing Protocols

### Automated Tests (`ChatWidget.test.tsx`)
- **Rendering**: Verifies the widget renders without crashing.
- **Interaction**: Tests opening/closing the chat and sending messages.
- **Validation**: Ensures empty messages cannot be sent.
- **Timing**: Mocks timers to verify the Welcome Popup appears after the set delay.

### Manual Quality Metrics
- **Coverage**: Verify that "gibberish" inputs trigger the Fallback response.
- **Accuracy**: Verify that specific keywords (e.g., "React", "Contact") trigger the correct Knowledge Base entry.
- **Performance**: Ensure animations run at 60fps and do not block the main thread.
