
export interface MinecraftGenerationState {
  originalImage: string | null;
  resultImage: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  progressMessage: string;
}

export interface ImagePart {
  inlineData: {
    mimeType: string;
    data: string;
  };
}

export interface TextPart {
  text: string;
}
