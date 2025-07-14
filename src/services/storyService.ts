import OpenAI from 'openai';
import { PetStoryRequest, PetStoryResponse } from '../types';

export class StoryService {
  private openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is required');
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateStory(request: PetStoryRequest): Promise<PetStoryResponse> {
    try {
      const prompt = this.createPrompt(request);
      
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a creative storyteller who writes engaging, heartwarming stories about pets. Your stories should be family-friendly, imaginative, and capture the unique personality of each pet.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.getMaxTokens(request.storyLength),
        temperature: 0.8,
      });

      const story = completion.choices[0]?.message?.content;
      
      if (!story) {
        throw new Error('No story generated');
      }

      const wordCount = story.split(' ').length;

      return {
        story,
        metadata: {
          generatedAt: new Date().toISOString(),
          wordCount,
          theme: request.storyTheme || 'adventure',
          petInfo: {
            name: request.petName,
            type: request.petType,
            ...(request.petBreed && { breed: request.petBreed }),
            ...(request.petAge && { age: request.petAge }),
          },
        },
      };
    } catch (error) {
      console.error('Error generating story:', error);
      throw new Error('Failed to generate story. Please try again.');
    }
  }

  private createPrompt(request: PetStoryRequest): string {
    const { petName, petType, petBreed, petAge, ownerName, storyTheme, storyLength } = request;
    
    let prompt = `Write a ${storyLength || 'medium'} ${storyTheme || 'adventure'} story about a ${petType} named ${petName}`;
    
    if (petBreed) {
      prompt += ` who is a ${petBreed}`;
    }
    
    if (petAge) {
      prompt += ` and is ${petAge} years old`;
    }
    
    prompt += `. The pet's owner is ${ownerName}`;
    
    prompt += `. Make the story engaging, heartwarming, and suitable for all ages. Include specific details about ${petName}'s personality and the bond with ${ownerName}.`;
    
    return prompt;
  }

  private getMaxTokens(length?: string): number {
    switch (length) {
      case 'short':
        return 200;
      case 'long':
        return 800;
      case 'medium':
      default:
        return 400;
    }
  }
}
