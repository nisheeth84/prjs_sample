export type ConfirmButton = {
  type: string;
  title: string;
  callback: () => void;
};

export type ConfirmPopupItem = {
  title: string;
  content: string;
  listButton: ConfirmButton[];
  modeConfirm?: number;
};
