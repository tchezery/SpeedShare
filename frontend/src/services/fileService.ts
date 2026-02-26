import { httpClient } from '../api/httpClient';
import { UploadResponse, FileNode } from '../types/dtos';

export const fileService = {
  // uploadFiles: async (files: File[], onProgress?: (progress: number) => void): Promise<UploadResponse> => {
  //   return httpClient.upload<UploadResponse>('/file/upload', files, onProgress);
  // },

  uploadFolder: async (files: File[], paths: string[], onProgress?: (progress: number) => void): Promise<UploadResponse> => {
    return httpClient.uploadWithPaths<UploadResponse>('/file/uploadV2', files, paths, onProgress);
  },

  // downloadFile: async (code: string): Promise<Blob> => {
  //   return httpClient.download(`/file/download/${code}`);
  // },

  downloadFiles: async (code: string, asZip: boolean = false): Promise<{ blob: Blob; filename: string | null }> => {
    const endpoint = asZip ? `/file/downloadV2/${code}?zip=true` : `/file/downloadV2/${code}`;
    return httpClient.download(endpoint);
  },

  // getFileInfo: async (code: string): Promise<FileNode> => {
  //   return httpClient.get<FileNode>(`/file/info/${code}`);
  // }

  getFileInfo: async (code: string): Promise<FileNode> => {
    return httpClient.get<FileNode>(`/file/infoV2/${code}`);
  }
};