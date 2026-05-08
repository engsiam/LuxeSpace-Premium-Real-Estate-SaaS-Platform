import prisma from '../../../prisma/client';
import env, { getServerUrl, getClientUrl } from '../../../config';

const getApiBase = (): string => {
  try {
    return getServerUrl();
  } catch {
    throw new Error('SERVER_URL is required');
  }
};

const getExploreUrl = (): string => {
  try {
    return `${getClientUrl()}/explore`;
  } catch {
    throw new Error('CLIENT_URL is required');
  }
};

export const chatWithAI = async (prompt: string) => {
  const apiBase = getApiBase();
  const exploreUrl = getExploreUrl();

  // Fetch recent properties from API
  let propertyList: any[] = [];
  try {
    const propRes = await fetch(`${apiBase}/api/v1/properties/ai-recent`);
    const propData = await propRes.json() as { success: boolean; data?: any[] };
    if (propData.success && propData.data) {
      propertyList = propData.data;
    }
  } catch (e) {
    console.error('Failed to fetch properties:', e);
  }

  // Also get all properties for context
  const allProperties = await prisma.property.findMany({
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

  const context = JSON.stringify(allProperties);
  const clientUrl = getClientUrl();

  const contactInfo = `
**For Premium Property Services, Contact:**
Md. Shohrab Hossain
📞 Phone: 01742080475
💬 WhatsApp: https://wa.me/8801742080475
📧 Email: shohrab@luxespace.com
🌐 Website: ${clientUrl}
`;

  // Check if user is asking about properties - return direct formatted response
  const propertyKeywords = ['browse', 'show properties', 'latest', 'apartments', 'villas', 'penthouses', 'spaces', 'properties', 'houses', 'flats'];
  const isPropertyQuery = propertyKeywords.some(kw => prompt.toLowerCase().includes(kw));
  
  if (isPropertyQuery && propertyList.length > 0) {
    const propertyResponse = propertyList
      .map(p => `[PROP]{"id":"${p.id}","title":"${p.title}","price":"${p.price}","location":"${p.location}","image":"${p.image || ''}"}[/PROP]`)
      .join('\n');
    
    return `Here are our latest available properties:\n\n${propertyResponse}\n\n[LINK]${exploreUrl}[/LINK]\n\n**For more details or to schedule a viewing, contact:**\n📞 01742080475\n💬 https://wa.me/8801742080475`;
  }

  try {
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

**Contact Info (ALWAYS share when user asks about contact, pricing, or premium services):**
${contactInfo}

**Recent Properties (5 latest - use these EXACTLY to show users):**
${JSON.stringify(propertyList.map(p => ({
  id: p.id,
  title: p.title,
  price: p.price,
  location: p.location,
  type: p.type,
  image: p.image,
})))}

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

**Your Behavior Rules - VERY IMPORTANT:**
- Be warm, professional, and concise — like a luxury hotel concierge for Bangladesh's top real estate
- ALWAYS mention contact info (01742080475 / Md. Shohrab Hossain / WhatsApp) when user asks about pricing, premium services, or contact details
- When user asks about properties (browse, show, latest, apartments, villas, penthouses, spaces) - you MUST use the 5 properties from "Recent Properties" list

- FOR EACH PROPERTY - output EXACTLY this format:
[PROP]{"id":"ID","title":"TITLE","price":"PRICE","location":"LOCATION","image":"URL"}[/PROP]

Example: [PROP]{"id":"123","title":"Modern Apartment in Gulshan","price":"৳50,00,000","location":"Gulshan, Dhaka","image":"https://..."}[/PROP]

- IMPORTANT: The price in the recent properties list ALREADY includes the ৳ symbol - use it exactly as shown
- DO NOT make up any property - only use the 5 properties from the list
- After showing properties, ALWAYS add: [LINK]${exploreUrl}[/LINK]
- NEVER show more than 5 properties
- Never show fake/placeholder data
- Short intro (1-2 sentences), then show properties, then contact info`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1000,
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
    if (error.message.includes('API key')) {
      return "AI service configuration issue. Please contact support.";
    }
    return `Welcome to LuxeSpace. We currently have ${allProperties.length} elite residences available in prime locations. For immediate assistance, contact Md. Shohrab Hossain at 01742080475. How can I help you find your dream home today?`;
  }
};
