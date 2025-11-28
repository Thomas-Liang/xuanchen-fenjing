export enum AspectRatio {
  ANAMORPHIC = '2.39:1',
  WIDESCREEN = '1.85:1',
  HD = '16:9',
  PORTRAIT = '9:16',
  SQUARE = '1:1'
}

export enum Resolution {
  RES_1K = '1K',
  RES_2K = '2K',
  RES_4K = '4K'
}

export enum CoreMode {
  SPACE_EXPLORATION = 'Space Exploration',
  NARRATIVE_STORY = 'Narrative Story',
  CYBERPUNK = 'Cyberpunk',
  NATURE_DOC = 'Nature Doc'
}

export interface ReferenceAsset {
  id: string;
  data: string; // base64
  mimeType: string;
  type: 'main' | 'auxiliary';
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  ratio: string;
}
