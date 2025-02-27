import type {
  User,
  GetAllPropertyRecordCards,
  GetAllUserRecordCards,
  GetAllReportRequestRecordCards,
  GetAllReportRecordCards,
  GetAllConversationCards,
  GetAllConversationMessageCards,
} from "@/types";

interface BaseState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: Error | null;
}

// Auth state types
interface AuthState extends BaseState {
  user: {
    username: string | null;
    isAuthenticated: boolean;
  };
}

// Property state types
interface PropertyState extends BaseState {
  data: GetAllPropertyRecordCards;
  lastFetched: number | null;
}
interface ReportState extends BaseState {
  data: GetAllReportRecordCards;
}

// Report state types
interface ReportRequestPollingState {
  activePollingId: number | null;
  pollingStartTime: number | null;
  pollingIntervalId: number | null;
}
interface ReportRequestState extends BaseState {
  data: GetAllReportRequestRecordCards;
  polling: ReportRequestPollingState;
}

// User state types
interface UserState extends BaseState {
  users: GetAllUserRecordCards;
  profile: User;
  passwordResetStatus: "idle" | "loading" | "succeeded" | "failed"; // TODO: Remove if unused
}
interface ChatState extends BaseState {
  conversations: GetAllConversationCards;
  conversationMessages: GetAllConversationMessageCards;
  activeConversationId: string | null;
}

export type {
  AuthState,
  PropertyState,
  ReportState,
  ReportRequestState,
  UserState,
  ChatState,
};
