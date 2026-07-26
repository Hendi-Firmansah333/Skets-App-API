import { create } from 'zustand';

interface ObjectData {
  id: string;
  label: string;
  confidence: number;
  bbox: number[];
  description: string;
  locked: boolean;
}

interface AppState {
  imageUrl: string | null;
  setImageUrl: (url: string | null) => void;
  
  isAnalyzing: boolean;
  setAnalyzing: (status: boolean) => void;
  
  detectedObjects: ObjectData[];
  setDetectedObjects: (objects: ObjectData[]) => void;
  toggleObjectLock: (id: string) => void;
  
  structuredJson: any | null;
  setStructuredJson: (json: any) => void;
  
  masterPrompt: string;
  setMasterPrompt: (prompt: string) => void;
  
  qualityLevel: string;
  setQualityLevel: (level: string) => void;
  
  // Configuration Form
  configTitle: string;
  setConfigTitle: (val: string) => void;
  configDescription: string;
  setConfigDescription: (val: string) => void;
  configTheme: string;
  setConfigTheme: (val: string) => void;
  configColors: string;
  setConfigColors: (val: string) => void;
  configInstructions: string;
  setConfigInstructions: (val: string) => void;

  // Banner Configuration
  outputType: "image" | "banner";
  setOutputType: (type: "image" | "banner") => void;
  bannerSize: string;
  setBannerSize: (val: string) => void;
  bannerTitle: string;
  setBannerTitle: (val: string) => void;
  bannerElements: string;
  setBannerElements: (val: string) => void;
  bannerContentText: string;
  setBannerContentText: (val: string) => void;
  bannerColors: string;
  setBannerColors: (val: string) => void;
}

export const useStore = create<AppState>((set) => ({
  imageUrl: null,
  setImageUrl: (url) => set({ imageUrl: url }),
  
  isAnalyzing: false,
  setAnalyzing: (status) => set({ isAnalyzing: status }),
  
  detectedObjects: [],
  setDetectedObjects: (objects) => set({ detectedObjects: objects }),
  
  toggleObjectLock: (id) => set((state) => ({
    detectedObjects: state.detectedObjects.map(obj => 
      obj.id === id ? { ...obj, locked: !obj.locked } : obj
    )
  })),
  
  structuredJson: null,
  setStructuredJson: (json) => set({ structuredJson: json }),
  
  masterPrompt: "",
  setMasterPrompt: (prompt) => set({ masterPrompt: prompt }),
  
  qualityLevel: "Detailed",
  setQualityLevel: (level) => set({ qualityLevel: level }),
  
  configTitle: "",
  setConfigTitle: (val) => set({ configTitle: val }),
  configDescription: "",
  setConfigDescription: (val) => set({ configDescription: val }),
  configTheme: "",
  setConfigTheme: (val) => set({ configTheme: val }),
  configColors: "",
  setConfigColors: (val) => set({ configColors: val }),
  configInstructions: "",
  setConfigInstructions: (val) => set({ configInstructions: val }),

  outputType: "image",
  setOutputType: (type) => set({ outputType: type }),
  bannerSize: "",
  setBannerSize: (val) => set({ bannerSize: val }),
  bannerTitle: "",
  setBannerTitle: (val) => set({ bannerTitle: val }),
  bannerElements: "",
  setBannerElements: (val) => set({ bannerElements: val }),
  bannerContentText: "",
  setBannerContentText: (val) => set({ bannerContentText: val }),
  bannerColors: "",
  setBannerColors: (val) => set({ bannerColors: val }),
}));
