export interface PetStoryRequest {
  petName: string;
  petType: string;
  petBreed?: string | undefined;
  petAge?: number | undefined;
  ownerName: string;
  storyTheme?: string | undefined;
  storyLength?: 'short' | 'medium' | 'long' | undefined;
}

export interface PetStoryResponse {
  story: string;
  metadata: {
    generatedAt: string;
    wordCount: number;
    theme: string;
    petInfo: {
      name: string;
      type: string;
      breed?: string;
      age?: number;
    };
  };
}

export interface APIError {
  error: string;
  status: number;
  details?: any;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  environment: string;
}
