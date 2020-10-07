export const GET_PROGRESS_BAR_INTERVAL = 50000; // 5 seconds

export const enum IMPORT_STEP {
  UPLOAD_FILE, // step 1
  MAPPING, // step 2
  AFTER_IMPORT, // step 3
  AFTER_IMPORT_ADD_TO_MY_LIST,
  AFTER_IMPORT_ADD_TO_SHARE_LIST,
  SIMULATION, // step 4
  EXECUTION, // step 5
  IMPORT_HISTORY,
  NONE // use to check blocked step, if none then can continue
}

export const enum IMPORT_TYPE {
  NEW_ONLY = 0,
  OVERWRITE_ONLY = 1,
  NEW_AND_OVERWRITE = 2,
  NONE = -1
}
