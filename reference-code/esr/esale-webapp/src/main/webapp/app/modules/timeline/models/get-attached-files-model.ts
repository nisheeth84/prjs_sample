/**
 * Define data structure for API getAttachedFiles
 **/

export type AttachedFilesType = {
  timelineId?: any;
  createdUserName?: any;
  createdDate?: any;
  attachedFile?: {
    filePath?: any;
    fileName?: any;
    fileUrl?: any;
  };
};
export type GetAttachedFiles = {
  attachedFiles?: AttachedFilesType[];
};
