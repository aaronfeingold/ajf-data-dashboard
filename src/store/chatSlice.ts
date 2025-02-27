"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { ChatState } from "@/types/store";
import type { Conversation, ConversationMessage } from "@/types/chat";
import type {
  GetAllConversationCards,
  GetAllConversationMessageCards,
} from "@/types/api";
import api, { handleApiResponse } from "@/app/api/axios";
import { CONVERSATION_MESSAGES, CONVERSATIONS } from "@/app/api/endpoints";

const initialState: ChatState = {
  conversations: {
    count: 0,
    data: [],
  },
  conversationMessages: {
    count: 0,
    data: [],
  },
  activeConversationId: null,
  error: null,
  status: "idle",
};

// Fetch conversations
export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      // todo: add pagination params and iterated till next is null
      return await handleApiResponse<Promise<GetAllConversationCards>>(
        api.get(CONVERSATIONS)
      );
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch conversations"
      );
    }
  }
);

// Create new conversation
export const createConversation = createAsyncThunk(
  "chat/createConversation",
  async (
    { title, user }: { title: string; user: number },
    { rejectWithValue }
  ) => {
    try {
      return await handleApiResponse<Promise<Conversation>>(
        api.post(CONVERSATIONS, {
          title,
          user,
        })
      );
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to create conversation"
      );
    }
  }
);

// Send message in a conversation
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    { conversation, message }: { conversation: number; message: string },
    { rejectWithValue }
  ) => {
    try {
      return await handleApiResponse<Promise<ConversationMessage>>(
        api.post(CONVERSATION_MESSAGES, {
          conversation,
          message,
        })
      );
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to send message"
      );
    }
  }
);

export const listMessages = createAsyncThunk(
  "chat/listMessages",
  async (
    _: { conversationId: string; message: string },
    { rejectWithValue }
  ) => {
    try {
      return await handleApiResponse<Promise<GetAllConversationMessageCards>>(
        api.get(CONVERSATION_MESSAGES)
      );
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to send message"
      );
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload;
    },
    clearActiveConversation: (state) => {
      state.activeConversationId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch conversations
      .addCase(fetchConversations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as Error;
      })
      // Create conversation
      .addCase(createConversation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversations.data.push(action.payload);
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as Error;
      })
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversationMessages.data.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as Error;
      });
  },
});

export const { setActiveConversation, clearActiveConversation } =
  chatSlice.actions;
export default chatSlice.reducer;
