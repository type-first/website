/**
 * OpenAI Embedding Provider
 * Generates embeddings using OpenAI's embedding models
 */

import type { EmbeddingProvider } from '../embedding.model';

export class OpenAIEmbeddingProvider implements EmbeddingProvider {
  private apiKey: string;
  private model: string;
  private dimension: number;
  private baseUrl: string;

  constructor(options: {
    apiKey: string;
    model?: string;
    baseUrl?: string;
  }) {
    this.apiKey = options.apiKey;
    this.model = options.model ?? 'text-embedding-3-small';
    this.baseUrl = options.baseUrl ?? 'https://api.openai.com/v1';
    
    // Set dimension based on model
    this.dimension = this.getModelDimension(this.model);
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) {
      return [];
    }

    try {
      const response = await fetch(`${this.baseUrl}/embeddings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          input: texts,
          encoding_format: 'float',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid response format from OpenAI API');
      }

      return data.data.map((item: any) => {
        if (!item.embedding || !Array.isArray(item.embedding)) {
          throw new Error('Invalid embedding format in response');
        }
        return item.embedding;
      });
    } catch (error) {
      console.error('Error generating embeddings:', error);
      throw error;
    }
  }

  getDimension(): number {
    return this.dimension;
  }

  getModelName(): string {
    return this.model;
  }

  getProviderName(): string {
    return 'openai';
  }

  /**
   * Get the dimension for a given OpenAI model
   */
  private getModelDimension(model: string): number {
    const dimensions: Record<string, number> = {
      'text-embedding-3-small': 1536,
      'text-embedding-3-large': 3072,
      'text-embedding-ada-002': 1536,
    };

    return dimensions[model] ?? 1536;
  }

  /**
   * Estimate the cost of embedding the given texts
   */
  estimateCost(texts: string[]): number {
    const totalTokens = texts.reduce((sum, text) => {
      // Rough token estimation
      return sum + Math.ceil(text.length / 4);
    }, 0);

    // Pricing as of 2024 (per 1M tokens)
    const pricePerMillionTokens = this.model === 'text-embedding-3-large' ? 0.13 : 0.02;
    
    return (totalTokens / 1_000_000) * pricePerMillionTokens;
  }

  /**
   * Get rate limits for the current model
   */
  getRateLimits(): { requestsPerMinute: number; tokensPerMinute: number } {
    // These are typical limits, may vary by account tier
    return {
      requestsPerMinute: 3000,
      tokensPerMinute: 1_000_000,
    };
  }
}
