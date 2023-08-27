export interface IImageMetadata {
  fileName: string;
  mimeType: string;
  metadata: Buffer;
  fileSize: number;
  owner: string;
}
