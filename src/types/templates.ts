export type BlockType = 'text' | 'image' | 'header' | 'footer' | 'table' | 'chart' | 'thermal_map';

export interface EditorBlock {
  id: string;
  type: BlockType;
  x: number; 
  y: number;
  width: number;
  height: number;
  content?: string;
  style?: {
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    italic?: boolean;
    lineHeight?: string;
    color?: string;
    backgroundColor?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    borderRadius?: string;
    opacity?: number;
    zIndex?: number;
    tableStyle?: string;
  };
  config?: Record<string, unknown>;
}

export interface TemplatePage {
  id: string;
  blocks: EditorBlock[];
}

export interface TemplateTheme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

export interface Template {
  id: string;
  name: string;
  thumbnail?: string;
  lastEdited: string;
  pages: TemplatePage[];
  theme: TemplateTheme;
}

export interface TemplateVariable {
  key: string;      
  label: string;    
  description: string;
  category: 'infestation' | 'client' | 'date';
}
