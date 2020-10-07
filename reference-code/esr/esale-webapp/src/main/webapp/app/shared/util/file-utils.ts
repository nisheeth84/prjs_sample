import { MAXIMUM_FILE_UPLOAD_KB } from 'app/config/constants';
import _ from 'lodash';

export const downloadFile = (fileName, link, actionError: () => void) => {
  fetch(link, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      Origin: window.location.origin
    }
  })
    .then(response => {
      response.blob().then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
      });
    })
    .catch(error => {
      actionError();
    });
};

export const isExceededCapacity = fileUploads => {
  let totalSize = 0;
  try {
    fileUploads.forEach(file => {
      const key = Object.keys(file)[0];
      totalSize += file[key].size;
    });
    return totalSize > MAXIMUM_FILE_UPLOAD_KB;
  } catch {
    return false;
  }
};

export const isExceededBigCapacity = (fileUploads, bigSize) => {
  let totalSize = 0;
  try {
    fileUploads.forEach(file => {
      const key = Object.keys(file)[0];
      totalSize += file[key].size;
    });
    return totalSize > bigSize;
  } catch {
    return false;
  }
};
