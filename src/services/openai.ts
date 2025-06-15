import OpenAI from 'openai';

// OpenAI API configuration
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'your-openai-api-key-here',
  dangerouslyAllowBrowser: true // Note: In production, API calls should be made from backend
});

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const generateAIResponse = async (messages: ChatMessage[]): Promise<string> => {
  try {
    const systemMessage = {
      role: 'system' as const,
      content: `Sen S-AI Chat adlı Türk yapay zeka asistanısın. Türkiye'de bulunan kullanıcılara Türkçe hizmet veriyorsun. 
      Yardımsever, bilgili ve samimi bir şekilde cevap ver. Türk kültürünü ve değerlerini anlıyorsun. 
      Sorulara detaylı ve faydalı cevaplar ver. Gerektiğinde örnekler kullan.`
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [systemMessage, ...messages],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'Üzgünüm, cevap oluşturamadım.';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Fallback response if API fails
    const fallbackResponses = [
      'Merhaba! Size nasıl yardımcı olabilirim? S-AI Chat olarak Türkçe sorularınızı yanıtlamaya hazırım.',
      'Bu konuda size yardımcı olmaya çalışacağım. Daha spesifik bir soru sorarsanız, daha detaylı bilgi verebilirim.',
      'İlginç bir konu! Bu konuda düşüncelerimi paylaşabilirim. Hangi açıdan yaklaşmamı istersiniz?',
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `${prompt} (high quality, detailed, artistic)`,
      size: '1024x1024',
      quality: 'standard',
      n: 1,
    });

    return response.data[0]?.url || '';
  } catch (error) {
    console.error('DALL-E API Error:', error);
    
    // Return a placeholder image URL if API fails
    return 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1024&h=1024&fit=crop';
  }
};