import prisma from '../../../prisma/client';
import env from '../../../config';

export const chatWithAI = async (prompt: string) => {
  const properties = await prisma.property.findMany({
    where: { status: 'AVAILABLE' },
    take: 20,
    select: {
      title: true,
      price: true,
      location: true,
      city: true,
      bhk: true,
      size: true,
      type: true,
      amenities: true,
    },
  });

  const context = JSON.stringify(properties);

  // Try OpenAI first, fallback to Gemini
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are LuxeSpace's AI real estate assistant for Bangladesh. 
            Answer questions based on the available properties data provided.
            Be helpful, concise, and property-focused.
            Available properties context: ${context}`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
      }),
    });

    const data = await response.json() as { choices?: { message?: { content?: string } }[] };
    return data.choices?.[0]?.message?.content || 'No response generated';
  } catch (error) {
    // Fallback: Return a simple response based on properties
    return `Based on our ${properties.length} available properties, I can help you find the perfect match. Please specify your preferences like location, budget, or property type.`;
  }
};
