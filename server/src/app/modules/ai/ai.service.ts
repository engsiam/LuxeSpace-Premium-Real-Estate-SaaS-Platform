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

  try {
    // Groq API Integration (OpenAI compatible)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are the AI Concierge for **LuxeSpace**, Bangladesh's premier luxury real estate platform. You help users find, explore, and book elite properties.

**Platform Overview:**
- LuxeSpace connects distinguished individuals with Bangladesh's most extraordinary architectural masterpieces
- We specialize in luxury apartments, penthouses, villas, and commercial spaces
- Primary markets: Dhaka, Chittagong, Sylhet, and other major cities
- All properties are verified for quality and prestige

**How LuxeSpace Works:**
1. Browse properties on the /explore page
2. View detailed property listings with photos, amenities, and pricing
3. Contact agents or request tours directly on each listing
4. Register/Login to save favorites and communicate with agents
5. Three user roles: User (buyer/renter), Agent (property manager), Admin

**Property Types Available:**
- Luxury apartments (1–5 BHK)
- Penthouses
- Villas
- Commercial spaces
- Investment properties

**Key Features:**
- 250+ premium properties listed
- 45+ elite verified agents
- 98% client satisfaction rate
- Dark mode interface, mobile responsive
- Blog with property investment insights
- AI-assisted property search (that's you!)

**Current Available Properties from Database:**
${context}

**Your Behavior Rules:**
- Be warm, professional, and concise — like a luxury hotel concierge
- Always try to match user needs to available properties in the database above
- If no matching property exists, acknowledge it and suggest alternatives or recommend they check /explore
- Never make up prices or property details not in the database
- Help with: property search, pricing questions, booking guidance, agent contact, investment advice
- Respond in the same language the user writes in (English or Bangla)
- Keep responses under 200 words unless more detail is specifically requested
- Use bullet points for lists of properties or features`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 600,
        temperature: 0.65,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json() as any;
      console.error('Groq API Error:', errorData);
      throw new Error(errorData.error?.message || 'Groq API Request Failed');
    }

    const data = await response.json() as { choices?: { message?: { content?: string } }[] };
    
    if (!data.choices || data.choices.length === 0) {
      return 'I am currently analyzing our portfolio. Please ask about our luxury villas or penthouses.';
    }

    return data.choices?.[0]?.message?.content || 'No response generated';
  } catch (error: any) {
    console.error('Chat AI Error:', error.message);
    // Fallback: Return a professional fallback based on property data
    return `Welcome to LuxeSpace. We currently have ${properties.length} elite residences available in prime locations. How can I help you find your dream home today?`;
  }
};
