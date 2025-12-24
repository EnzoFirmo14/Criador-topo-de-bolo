
export interface ProcessingState {
  isProcessing: boolean;
  status: string;
  progress: number;
}

export interface TopperData {
  name: string;
  age: string;
  originalImage: string | null;
  processedImage: string | null;
}
