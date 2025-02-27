interface Tokens {
  access: string;
  refresh: string;
}

interface TokenErrorResponse {
  detail: string;
  code: string;
  messages: {
    token_class: string;
    token_type: string;
    message: string;
  }[];
}

interface RefreshResponse {
  access: string;
}

export type { Tokens, TokenErrorResponse, RefreshResponse };
