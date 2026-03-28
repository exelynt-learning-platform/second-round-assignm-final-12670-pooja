import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { callOpenAI } from '../../services/openaiService';

// ─── localStorage helpers ──────────────────────────────────────────────────────

const STORAGE_KEY = 'ai_chat_sessions';

function loadSessions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveSessions(sessions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // Silently fail if storage is full
  }
}

// ─── Initial State ─────────────────────────────────────────────────────────────

const DEFAULT_SESSION = {
  id: Date.now().toString(),
  title: 'New Chat',
  messages: [],
};

const saved = loadSessions();
const initialState = {
  sessions: saved?.sessions || [DEFAULT_SESSION],
  activeSessionId: saved?.activeSessionId || DEFAULT_SESSION.id,
  loading: false,
  error: null,
};

// ─── Async Thunk ───────────────────────────────────────────────────────────────

/**
 * sendMessage — creates AsyncThunk that:
 * 1. Appends user message to state
 * 2. Sends full conversation history to OpenAI
 * 3. Appends AI reply or dispatches error
 */
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (userText, { getState, rejectWithValue }) => {
    try {
      const state = getState().chat;
      const activeSession = state.sessions.find(
        (s) => s.id === state.activeSessionId
      );

      // Build messages array in OpenAI format (system + history + new user msg)
      const historyMessages = activeSession.messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const allMessages = [
        {
          role: 'system',
          content:
            'You are a helpful, concise, and friendly AI assistant. Format your responses using Markdown when appropriate.',
        },
        ...historyMessages,
        { role: 'user', content: userText },
      ];

      const aiResponse = await callOpenAI(allMessages);
      return aiResponse;
    } catch (err) {
      // Translate error codes into user-friendly messages
      if (err.response) {
        const status = err.response.status;
        if (status === 401) {
          return rejectWithValue(
            'Invalid API key. Please check your VITE_OPENAI_API_KEY in the .env file.'
          );
        }
        if (status === 429) {
          return rejectWithValue(
            'Rate limit exceeded. Please wait a moment before sending another message.'
          );
        }
        if (status === 500) {
          return rejectWithValue(
            'The AI service is experiencing issues. Please try again later.'
          );
        }
        return rejectWithValue(
          `API error (${status}): ${err.response.data?.error?.message || 'Unknown error'}`
        );
      }
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        return rejectWithValue(
          'Request timed out. Please check your internet connection and try again.'
        );
      }
      return rejectWithValue(err.message || 'An unexpected error occurred.');
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────────────────────

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    /** Dismiss the current error banner */
    clearError(state) {
      state.error = null;
    },

    /** Clear messages in the active session */
    clearChat(state) {
      const session = state.sessions.find((s) => s.id === state.activeSessionId);
      if (session) {
        session.messages = [];
        session.title = 'New Chat';
      }
      saveSessions({ sessions: state.sessions, activeSessionId: state.activeSessionId });
    },

    /** Create a brand-new chat session and make it active */
    addSession(state) {
      const newSession = {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [],
      };
      state.sessions.unshift(newSession);
      state.activeSessionId = newSession.id;
      state.error = null;
      saveSessions({ sessions: state.sessions, activeSessionId: state.activeSessionId });
    },

    /** Switch active session */
    setActiveSession(state, action) {
      state.activeSessionId = action.payload;
      state.error = null;
      saveSessions({ sessions: state.sessions, activeSessionId: state.activeSessionId });
    },

    /** Delete a chat session */
    deleteSession(state, action) {
      state.sessions = state.sessions.filter((s) => s.id !== action.payload);
      if (state.sessions.length === 0) {
        const newSession = { id: Date.now().toString(), title: 'New Chat', messages: [] };
        state.sessions.push(newSession);
      }
      if (state.activeSessionId === action.payload) {
        state.activeSessionId = state.sessions[0].id;
      }
      saveSessions({ sessions: state.sessions, activeSessionId: state.activeSessionId });
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Pending: user sent a message ──────────────────────────────────────
      .addCase(sendMessage.pending, (state, action) => {
        state.loading = true;
        state.error = null;

        // Immediately add the user message to the session
        const userMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: action.meta.arg,
          timestamp: new Date().toISOString(),
        };
        const session = state.sessions.find((s) => s.id === state.activeSessionId);
        if (session) {
          session.messages.push(userMessage);
          // Auto-title the session using first message (truncated)
          if (session.messages.length === 1) {
            session.title =
              action.meta.arg.length > 40
                ? action.meta.arg.substring(0, 40) + '…'
                : action.meta.arg;
          }
        }
        saveSessions({ sessions: state.sessions, activeSessionId: state.activeSessionId });
      })
      // ── Fulfilled: AI responded ───────────────────────────────────────────
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;

        const aiMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: action.payload,
          timestamp: new Date().toISOString(),
        };
        const session = state.sessions.find((s) => s.id === state.activeSessionId);
        if (session) {
          session.messages.push(aiMessage);
        }
        saveSessions({ sessions: state.sessions, activeSessionId: state.activeSessionId });
      })
      // ── Rejected: error occurred ──────────────────────────────────────────
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong. Please try again.';
      });
  },
});

export const { clearError, clearChat, addSession, setActiveSession, deleteSession } =
  chatSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────────────────────

export const selectActiveSession = (state) =>
  state.chat.sessions.find((s) => s.id === state.chat.activeSessionId);

export const selectMessages = (state) => selectActiveSession(state)?.messages || [];

export const selectLoading = (state) => state.chat.loading;

export const selectError = (state) => state.chat.error;

export const selectSessions = (state) => state.chat.sessions;

export const selectActiveSessionId = (state) => state.chat.activeSessionId;

export default chatSlice.reducer;
