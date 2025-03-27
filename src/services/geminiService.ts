
// // Service to interact with Google's Gemini API
import { useState } from 'react';

interface GeminiResponse {
  text: string;
  isLoading: boolean;
  error: string | null;
}

interface GeminiMessage {
  role: 'user' | 'model';
  content: string;
}

export const sendMessageToGemini = async (
  messages: GeminiMessage[],
  apiKey: string = 'AIzaSyAXeyLkZ51jq9hwJtom7iUqo1PTa57hOcs'
): Promise<string> => {
  try {
    // Updated API endpoint to the correct version
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: messages.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }]
        })),
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`Error from Gemini API: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

export const useGeminiContext = (initialMessages: GeminiMessage[] = []) => {
  const [messages, setMessages] = useState<GeminiMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (userMessage: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Add user message to context
      const updatedMessages: GeminiMessage[] = [
        ...messages, 
        { role: 'user' as const, content: userMessage }
      ];
      setMessages(updatedMessages);
      
      // Get response from Gemini
      const response = await sendMessageToGemini(updatedMessages);
      
      // Add Gemini response to context
      setMessages([
        ...updatedMessages,
        { role: 'model' as const, content: response }
      ]);
      
      return response;
    } catch (err: any) {
      setError(err.message || 'An error occurred while communicating with Gemini');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages
  };
};
