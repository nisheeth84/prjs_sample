export type ButtonVariant =
  | "complete"
  | "incomplete"
  | "delete"
  | "miniModal"
  | "dialog";

export interface I18nMessage {
  id: string;
  defaultMessage: string;
}

export interface I18nMessages {
  [key: string]: I18nMessage;
}

export type LoadState = 'initial' | 'loading' | 'succeeded' | 'failed'| 'noData'|'noDataOnDraft';
