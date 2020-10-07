export class CsvFile {
  headers: string[];
  rows: string[][];
  name: string;
  type: string;
  ext: string;
  file: File;
  size: number;

  constructor(fileData = null) {
    if (!fileData) {
      return;
    }

    // parse file records
    if (fileData.data.length > 0) {
      this.headers = Object.keys(fileData.data[0]);
      this.rows = fileData.data.map(record => Object.values(record));
    }

    // parse file info
    this.name = fileData.name;
    this.type = fileData.type;
    this.ext = fileData.name
      .split('.')
      .pop()
      .toLowerCase();
    this.file = fileData.file;
    this.size = fileData.size;
  }
}
