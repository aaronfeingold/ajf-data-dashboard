import { API_VERSION } from "@/lib/constants";

const endpointKeys = [
  "TOKEN",
  "REPORTS",
  "REPORT_REQUESTS",
  "PROPERTY_RECORD_CARDS",
  "USERS",
  "CONVERSATIONS",
  "CONVERSATION_MESSAGES",
];

const endpoints = Object.fromEntries(
  endpointKeys.map((key) => [
    key,
    key === "TOKEN"
      ? "token/"
      : `${API_VERSION}/${key.toLowerCase().replace(/_/g, "")}/`,
  ])
);

export const {
  TOKEN,
  REPORTS,
  REPORT_REQUESTS,
  PROPERTY_RECORD_CARDS,
  USERS,
  CONVERSATIONS,
  CONVERSATION_MESSAGES,
} = endpoints;
