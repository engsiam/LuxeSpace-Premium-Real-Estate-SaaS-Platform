import prisma from '../src/prisma/client';
import bcrypt from 'bcrypt';

const locations = [
  'Gulshan 2', 'Banani', 'Dhanmondi', 'Uttara Sector 3', 'Baridhara', 
  'Bashundhara R/A', 'Mirpur', 'Savar', 'Ghatarchar', 'Moghbazar',
  'Nikunja', 'Khilkhet', 'Badda', 'Jatrabari', 'Lalbagh'
];

const propertyTypes = ['Apartment', 'Penthouse', 'Villa', 'Commercial Space', 'Duplex', 'Studio Apartment'];

const realPropertyImages = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
  'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
  'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3b5?w=800',
  'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800',
  'https://images.unsplash.com/photo-1600210492493-0946911122ea?w=800',
  'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800',
  'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800',
  'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800',
  'https://images.unsplash.com/photo-1600566752734-2a0cd66c42a1?w=800',
  'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800',
  'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800',
  'https://images.unsplash.com/photo-1600047509782-20d39509f83d?w=800',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800',
  'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800',
  'https://images.unsplash.com/photo-1600563438938-a9a27216b4f5?w=800',
  'https://images.unsplash.com/photo-1600573472556-e636c2acda5e?w=800',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800',
  'https://images.unsplash.com/photo-1600563438871-41f0b3c8d9b4?w=800',
  'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800'
];

const realBlogImages = [
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
  'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800',
  'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800',
  'https://images.unsplash.com/photo-1600210492493-0946911122ea?w=800',
  'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800',
  'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800',
  'https://images.unsplash.com/photo-1600563438938-a9a27216b4f5?w=800',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800',
  'https://images.unsplash.com/photo-1600573472556-e636c2acda5e?w=800',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
  'https://images.unsplash.com/photo-1600566752734-2a0cd66c42a1?w=800',
  'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800',
  'https://images.unsplash.com/photo-1600047509782-20d39509f83d?w=800',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
  'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800',
  'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800',
  'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800',
  'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800',
  'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800',
  'https://images.unsplash.com/photo-1600563438871-41f0b3c8d9b4?w=800',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
];

const properties = [
  { title: "Luxury 3BHK Apartment in Gulshan - Prime Location", price: 8500000, bhk: 3, size: 1850, type: "Apartment", location: "Gulshan 2" },
  { title: "Modern 4BHK Penthouse with Rooftop Access", price: 15000000, bhk: 4, size: 3200, type: "Penthouse", location: "Banani" },
  { title: "Spacious 2BHK Apartment Near Metro Station", price: 4500000, bhk: 2, size: 1200, type: "Apartment", location: "Uttara Sector 3" },
  { title: "Exclusive 5BHK Villa with Private Garden", price: 28000000, bhk: 5, size: 4500, type: "Villa", location: "Baridhara" },
  { title: "Premium 3BHK Apartment in Bashundhara R/A", price: 7200000, bhk: 3, size: 1650, type: "Apartment", location: "Bashundhara R/A" },
  { title: "Commercial Office Space in Moghbazar", price: 12000000, bhk: 0, size: 2000, type: "Commercial Space", location: "Moghbazar" },
  { title: "Elegant 4BHK Duplex in Dhanmondi", price: 11000000, bhk: 4, size: 2800, type: "Duplex", location: "Dhanmondi" },
  { title: "Cozy Studio Apartment for Young Professionals", price: 2500000, bhk: 1, size: 650, type: "Studio Apartment", location: "Nikunja" },
  { title: "Luxury 3BHK with Panoramic City Views", price: 9500000, bhk: 3, size: 2000, type: "Apartment", location: "Gulshan 2" },
  { title: "Family-Friendly 4BHK Apartment Near School", price: 8800000, bhk: 4, size: 2200, type: "Apartment", location: "Ghatarchar" },
  { title: "Modern Commercial Space in Badda", price: 8500000, bhk: 0, size: 1500, type: "Commercial Space", location: "Badda" },
  { title: "Premium 2BHK Apartment with Gym & Pool", price: 5500000, bhk: 2, size: 1100, type: "Apartment", location: "Khilkhet" },
  { title: "5BHK Grand Villa in Mirpur DOHS", price: 32000000, bhk: 5, size: 5000, type: "Villa", location: "Mirpur" },
  { title: "Affordable 2BHK in Savar Near Airport", price: 3200000, bhk: 2, size: 950, type: "Apartment", location: "Savar" },
  { title: "Executive 4BHK Penthouse in Banani", price: 18500000, bhk: 4, size: 3500, type: "Penthouse", location: "Banani" },
  { title: "3BHK Furnished Apartment for Rent", price: 6800000, bhk: 3, size: 1550, type: "Apartment", location: "Baridhara" },
  { title: "Retail Space in Prime Shopping Area", price: 15000000, bhk: 0, size: 2500, type: "Commercial Space", location: "Gulshan" },
  { title: "Modern 3BHK with Smart Home Features", price: 7800000, bhk: 3, size: 1750, type: "Apartment", location: "Bashundhara R/A" },
  { title: "Classic 4BHK Duplex in Jatrabari", price: 7500000, bhk: 4, size: 2100, type: "Duplex", location: "Jatrabari" },
  { title: "Luxury 2BHK Corner Unit with Balcony", price: 6200000, bhk: 2, size: 1350, type: "Apartment", location: "Gulshan 2" },
  { title: "Commercial Warehouse in Savar EPZ", price: 9500000, bhk: 0, size: 3000, type: "Commercial Space", location: "Savar" },
  { title: "Premium 3BHK Near International School", price: 8200000, bhk: 3, size: 1900, type: "Apartment", location: "Banani" },
  { title: "4BHK Family Apartment in Lalbagh", price: 5800000, bhk: 4, size: 1700, type: "Apartment", location: "Lalbagh" },
  { title: "Penthouse with Private Terrace Garden", price: 22000000, bhk: 5, size: 4200, type: "Penthouse", location: "Dhanmondi" },
  { title: "Budget-Friendly 1BHK Starter Home", price: 1800000, bhk: 1, size: 500, type: "Studio Apartment", location: "Uttara" },
  { title: "Corporate Office Space in Tech Valley", price: 18000000, bhk: 0, size: 3500, type: "Commercial Space", location: "Badda" },
  { title: "Modern 3BHK with Open Kitchen Design", price: 7100000, bhk: 3, size: 1600, type: "Apartment", location: "Mirpur" },
  { title: "5BHK Beach-View Villa Concept", price: 25000000, bhk: 5, size: 4000, type: "Villa", location: "Baridhara" },
  { title: "2BHK Investment Property with High Rental Yield", price: 4200000, bhk: 2, size: 1000, type: "Apartment", location: "Ghatarchar" },
  { title: "Ultra-Luxury Penthouse with Helipad Access", price: 45000000, bhk: 6, size: 6000, type: "Penthouse", location: "Gulshan 2" }
];

const blogs = [
  {
    title: "Complete Guide to Buying Your First Home in Bangladesh",
    slug: "complete-guide-buying-first-home-bangladesh",
    excerpt: "Everything you need to know about purchasing your first property in Bangladesh, from legal requirements to financing options.",
    content: `Buying your first home is a life-changing decision, especially in Bangladesh's dynamic real estate market. This comprehensive guide will walk you through every step of the process.

**1. Set Your Budget**
Before starting your search, determine your budget. Consider not just the property price but also registration costs (2-3% of property value), stamp duty, and legal fees. Most banks offer home loans at 8-12% interest rates.

**2. Choose the Right Location**
In Dhaka, location is everything. Consider:
- Proximity to workplace
- Schools and hospitals nearby
- Transportation connectivity
- Future development plans

Gulshan, Banani, and Dhanmondi remain premium areas, but emerging neighborhoods like Uttara and Purbachal offer better value.

**3. Verify Property Documents**
Essential documents to check:
- Title Deed (অনাবাদি দলিল)
- Mutation Records (মিউটেশন)
- No Encumbrance Certificate
- Building Plan Approval

**4. Choose the Developer**
Research the developer's:
- Track record
- Completed projects
- Customer reviews
- Financial stability

**5. Property Inspection**
Visit multiple times. Check:
- Water supply and drainage
- Electricity and gas connections
- Parking facilities
- Neighbor quality

**6. Finalize the Deal**
Negotiate wisely. Token money (10-20%) shows intent. Ensure all terms are in writing.

Remember: Don't rush. The perfect home is worth the wait!`
  },
  {
    title: "Why Gulshan Remains Dhaka's Most Premium Real Estate Destination",
    slug: "why-gulshan-premium-real-estate-dhaka",
    excerpt: "An analysis of why Gulshan continues to be the top choice for luxury property investors in Bangladesh.",
    content: `Gulshan has been Dhaka's most prestigious neighborhood for decades. Here's why it remains the top choice for discerning buyers:

**Strategic Location**
Gulshan offers unmatched connectivity to:
- Major business districts
- Embassies and High Commissions
- International schools
- Premium hospitals

**Investment Returns**
Properties in Gulshan consistently deliver:
- 6-8% annual rental yields
- 10-15% annual capital appreciation
- Strong resale value

**Infrastructure Excellence**
- Wide roads and well-maintained infrastructure
- Reliable electricity and water supply
- Excellent drainage systems
- 24/7 security in most areas

**Tenant Quality**
The area attracts:
- Expatriates and diplomats
- Corporate executives
- High-net-worth individuals
- International organization staff

**Amenities & Lifestyle**
- Premium shopping centers
- Fine dining restaurants
- Fitness clubs and spas
- Parks and recreational areas

**Market Trends**
Despite economic fluctuations, Gulshan real estate has proven resilient. Properties here maintain value better than anywhere else in Dhaka.

**Investment Strategy**
For maximum returns:
- Buy during market downturns
- Focus on properties above 2000 sq ft
- Look for rental income potential
- Hold for long-term appreciation

The bottom line: If budget allows, Gulshan remains the safest bet in Dhaka real estate.`
  },
  {
    title: "The Rise of Penthouses: Luxury Living at Its Finest in Bangladesh",
    slug: "rise-of-penthouses-luxury-living-bangladesh",
    excerpt: "Explore the growing trend of penthouse living in Dhaka and why ultra-high-net-worth individuals are choosing rooftop residences.",
    content: `Penthouse living has become the ultimate status symbol in Dhaka's luxury real estate market. Here's what's driving this trend:

**What Makes Penthouses Special**
- 360-degree panoramic views of the city skyline
- Complete privacy with no shared walls
- Private terraces and outdoor spaces
- Smart home technology
- Premium finishes (Italian marble, imported fixtures)

**Top Penthouse Locations in Dhaka**
1. Gulshan 2 - Most exclusive
2. Banani - Premium with great views
3. Baridhara - Diplomatic enclave
4. Dhanmondi - Central location

**Price Range**
- Standard penthouses: ৳50 lakh - ৳2 crore
- Luxury penthouses: ৳2 crore - ৳5 crore
- Ultra-luxury: ৳5 crore+

**Key Features Buyers Look For**
- Private elevator access
- Rooftop garden
- Home theater
- Professional kitchen
- Staff quarters
- Multiple parking spaces

**Investment Potential**
Penthouses appreciate faster than regular apartments:
- Limited supply
- High demand from HNIs
- Unique positioning

**Future Trends**
Developers are now offering:
- Sky pools
- Private gyms
- Rooftop jacuzzis
- Green terraces

For those who can afford it, a penthouse isn't just a home—it's a statement.`
  },
  {
    title: "Commercial Real Estate: The Hidden Investment Goldmine in Bangladesh",
    slug: "commercial-real-estate-investment-goldmine-bangladesh",
    excerpt: "Why smart investors are shifting focus to commercial properties for higher returns and stable income.",
    content: `Beyond residential properties, commercial real estate offers exceptional opportunities for discerning investors in Bangladesh:

**Types of Commercial Properties**

1. **Office Spaces**
- Grade A offices in prime locations
- 8-12% rental yields
- Long-term leases (5-10 years)
- Corporate tenants = stable income

2. **Retail Spaces**
- Shopping complexes in strategic areas
- Percentage rent + base rent structure
- Anchor tenant guarantees
- Foot traffic = business success

3. **Warehouses & Logistics**
- E-commerce boom creating massive demand
- 10-15% returns possible
- Long-term leases to established companies

4. **Hotels & Hospitality**
- Tourism growth = hotel demand
- Partnership opportunities with chains
- Seasonal but profitable

**Key Investment Strategies**

*Location Analysis*
- Business districts (Gulshan, Banani, Motijheel)
- Transit hubs (near airports, stations)
- Emerging commercial zones

*Tenant Quality Matters*
- Multinational companies = reliable
- Financial institutions = stable
- Healthcare providers = long-term

*Due Diligence Required*
- Verify building permits
- Check utility connections
- Review lease terms
- Assess maintenance costs

**Risk Factors to Consider**
- Economic downturn impact
- Vacancy periods
- Maintenance costs
- Regulatory changes

**Expert Tips**
1. Start with smaller commercial units
2. Diversify across locations
3. Work with established developers
4. Hire professional property managers

Commercial real estate isn't for everyone, but for those with capital and patience, it offers superior returns.`
  },
  {
    title: "Interior Design Trends for Modern Bangladeshi Homes in 2026",
    slug: "interior-design-trends-2026-bangladesh",
    excerpt: "Discover the latest interior design concepts that are transforming homes across Dhaka and Bangladesh.",
    content: `Modern interior design in Bangladesh is evolving rapidly. Here are the top trends for 2026:

**Color Palettes**
- Soft neutrals (cream, beige, gray)
- Bold accent colors (emerald, navy, gold)
- Earth tones trending
- White厨房 remains popular

**Materials in Demand**
- Italian marble for flooring
- Quartz countertops
- Teak wood furniture
- Bamboo and rattan accents

**Smart Home Features**
- Voice-controlled lighting
- Automated curtains
- Smart thermostats
- Security systems with app control

**Space-Saving Solutions**
- Multi-functional furniture
- Built-in storage units
- Wall-mounted everything
- Modular kitchen systems

**Bangladeshi Cultural Elements**
- Jamdani as wall art
- Terracotta pottery displays
- Pattachitra-inspired motifs
- Brass and copper artifacts

**Lighting Trends**
- Layered lighting (ambient + task + accent)
- LED strip lighting
- Statement chandeliers
- Natural light maximization

**Outdoor Living**
- Balcony gardens
- Terrace seating areas
- Indoor-outdoor flow
- Vertical gardens

**Professional Tips**
1. Hire interior designers early
2. Plan for future needs
3. Quality over quantity
4. Mix local and imported materials

The best designs balance modern comfort with Bangladeshi cultural identity.`
  },
  {
    title: "Property Registration Made Simple: A Step-by-Step Guide",
    slug: "property-registration-step-by-step-guide",
    excerpt: "Navigate the property registration process in Bangladesh with confidence using this detailed guide.",
    content: `Property registration in Bangladesh can seem daunting, but it doesn't have to be. Here's your complete guide:

**Step 1: Document Verification**
Gather and verify:
- Title Deed (অনাবাদি দলিল)
- Khatiyan (Land Records)
- Mutation documents
- No Objection Certificate (if applicable)

**Step 2: Title Search**
Visit the local Sub-Registry Office:
- Purpose: Verify ownership
- Cost: ৳500-2000
- Time: 1-3 days

**Step 3: Pay Token Money**
- Typically 10-20% of property value
- Get receipt for documentation

**Step 4: Registration Process**
At Sub-Registry Office:
1. Submit all documents
2. Pay Stamp Duty (1.5% of value)
3. Pay Registration Fee (1%)
4. Pay Mutation Fee (2%)

**Step 5: Collect Registered Deed**
- Usually available in 7-14 days
- Verify all details are correct

**Step 6: Mutation**
Update land records:
- Apply at local land office
- Pay mutation fee
- Process takes 2-4 weeks

**Costs Summary**
- Stamp Duty: 1.5%
- Registration Fee: 1%
- Mutation: 2%
- Legal Fees: 1-2%
- Miscellaneous: ৳10,000-50,000

**Tips from Experts**
1. Engage a qualified property lawyer
2. Don't rush the process
3. Verify all documents personally
4. Keep copies of everything
5. Ask for receipts for all payments

Patience and due diligence are key to a successful property registration.`
  },
  {
    title: "The Future of Dhaka Real Estate: Trends to Watch in 2026 and Beyond",
    slug: "future-dhaka-real-estate-2026-beyond",
    excerpt: "From smart cities to sustainable living, discover what's shaping the future of real estate in Dhaka.",
    content: `Dhaka's real estate landscape is evolving rapidly. Here are the key trends that will shape the market:

**Emerging Areas**
- **Purbachal**: New smart city project
- **Uttara Extension**: Affordable options
- **Badda Innovation Hub**: Tech-driven development
- **Keraniganj**: Riverfront development

**Transit-Oriented Development**
Properties near metro stations are commanding premium prices:
- Station proximity = 15-20% price premium
- Future metro lines = investment potential

**Sustainable and Green Buildings**
- LEED-certified buildings emerging
- Solar power systems
- rainwater harvesting
- Energy-efficient designs

**Technology Integration**
- Virtual property tours
- Digital contracts
- Blockchain for verification
- AI-powered property matching

**Mixed-Use Developments**
Combining residential, commercial, and retail:
- Reduced commute times
- All amenities in one location
- Higher property values

**Affordable Housing Initiatives**
Government programs supporting:
- Low-cost housing projects
- Mortgage subsidies
- First-time buyer programs

**Market Predictions**
- 10-15% annual appreciation expected
- Rental yields to remain strong (6-8%)
- Commercial sector to outperform

**Investment Strategy**
1. Focus on transit-connected areas
2. Consider emerging neighborhoods
3. Look for sustainable features
4. Think long-term (5+ years)

The future of Dhaka real estate is exciting. Stay informed and act strategically.`
  },
  {
    title: "Understanding Property Taxes and Legal Requirements in Bangladesh",
    slug: "property-taxes-legal-requirements-bangladesh",
    excerpt: "Everything property owners need to know about taxes, legal obligations, and compliance in Bangladesh.",
    content: `As a property owner in Bangladesh, understanding your tax and legal obligations is crucial. Here's a comprehensive guide:

**Property Taxes**
- Annual Property Tax: 0.5-1.5% of annual value
- City Corporation Tax: Included in property tax
- Tax varies by location and property type

**Registration Costs (One-time)**
- Stamp Duty: 1.5% of property value
- Registration Fee: 1%
- Mutation Fee: 2%
- Legal Fees: 1-2% (negotiable)

**Income Tax Implications**
- Rental Income: Taxed at personal rate
- Annual Return filing required
- Expenses can be deducted
- Tax withheld at source (optional)

**Legal Requirements**
1. Annual Property Tax payment
2. Building insurance (recommended)
3. Fire insurance (for apartments)
4. Gas/Electricity bill clearance

**Penalties for Non-Compliance**
- Late property tax: 2% monthly penalty
- Unregistered property: Cannot sell/mortgage
- Tax evasion: Legal action possible

**Tips for Compliance**
1. Maintain proper records
2. File annual returns on time
3. Keep property documents safe
4. Update details after any transaction

**Exemptions Available**
- First home exemption (conditions apply)
- Agricultural property
- Religious institutions

Consult a tax professional for personalized advice. Proper compliance protects your investment.`
  },
  {
    title: "How to Choose the Right Real Estate Agent in Bangladesh",
    slug: "choose-right-real-estate-agent-bangladesh",
    excerpt: "Finding a trustworthy and competent real estate agent can make your property journey much smoother.",
    content: `A good real estate agent can save you time, money, and stress. Here's how to find the right one in Bangladesh:

**Qualities to Look For**

*Professional Credentials*
- Valid trade license
- Membership in real estate associations
- Professional training/certifications

*Market Knowledge*
- Expert in your target area
- Understanding of property values
- Knowledge of legal requirements

*Track Record*
- Successful transactions
- Client testimonials
- Years of experience

*Communication Skills*
- Responsive to queries
- Clear communication
- Honest and transparent

**Red Flags to Avoid**
- No verifiable track record
- Unrealistic promises
- Pressuring you to decide quickly
- Not providing documentation
- Unclear fee structure

**Questions to Ask**
1. How many transactions have you completed?
2. What's your specialization area?
3. Can you provide client references?
4. What's your fee structure?
5. How will you handle legal verification?

**Agent vs. DIY**
*Using an Agent:*
- Expert guidance
- Legal verification
- Negotiation support
- Post-sale assistance

*DIY:*
- Save on commission
- Direct control
- More work required
- Risk of errors

**Building a Relationship**
- Communicate clearly
- Provide feedback
- Trust but verify
- Long-term partnership benefits

A great agent is worth their weight in gold. Take time to find the right one.`
  },
  {
    title: "Investment vs. End-Use: Making the Right Property Decision",
    slug: "investment-vs-end-use-property-decision",
    excerpt: "Should you buy property for investment or personal use? Here's how to make the right choice for your situation.",
    content: `The fundamental question every buyer faces: Investment or end-use? Here's how to decide:

**For End-Use Buyers (Self-Living)**

*Priorities:*
- Location convenience
- Budget alignment
- Lifestyle requirements
- Future flexibility

*Questions to Ask:*
- How long will you stay?
- Does it meet family needs?
- Is it within commute distance?
- Are schools/hospitals nearby?

*Best Fit:*
- Ready properties in proven areas
- Properties needing renovation in good locations

**For Investment Buyers**

*Priorities:*
- Rental yield potential
- Capital appreciation
- Market liquidity
- Tenant demand

*Questions to Ask:*
- What's the rental yield?
- Is appreciation likely?
- How easily can you sell?
- Who's the target tenant?

*Best Fit:*
- New developments in emerging areas
- Commercial properties
- Properties near transit

**Hybrid Strategy**
Many do both:
- Buy now for investment
- Live in initially
- Rent out later
- Sell when appreciation peaks

**Key Decision Factors**

| Factor | End-Use | Investment |
|--------|---------|-------------|
| Timeline | Immediate | 5+ years |
| Location Priority | Convenience | Growth |
| Budget | Personal means | Using leverage |
| Risk | Lower acceptable | Higher acceptable |

**Expert Advice**
1. Don't mix emotions with investment
2. Run the numbers
3. Consider opportunity cost
4. Factor in maintenance
5. Plan exit strategy

Whatever you choose, make an informed decision based on your goals.`
  },
  {
    title: "Understanding Home Loans and Financing Options in Bangladesh",
    slug: "home-loans-financing-options-bangladesh",
    excerpt: "Navigate the various home financing options available in Bangladesh to make the best financial decision.",
    content: `Buying a home is likely the biggest purchase of your life. Understanding financing options is crucial:

**Banks Offering Home Loans**
- Brac Bank
- Standard Chartered
- Dhaka Bank
- City Bank
- Eastern Bank
- IPDC Finance

**Typical Loan Terms**
- Interest Rate: 8-12% (reducing)
- Tenure: 5-20 years
- Loan Amount: 50-70% of property value
- Processing Fee: 0.5-1%

**Eligibility Criteria**
- Minimum income: ৳50,000/month
- Age: 25-55 years
- Job stability: 2+ years
- Credit score: Good history

**Required Documents**
- National ID
- Income verification
- Property documents
- Bank statements (12 months)
- Employer verification

**Types of Loans**
1. **Construction Loan** - Build on own land
2. **Purchase Loan** - Buy ready property
3. **Balance Transfer** - Switch from another bank
4. **Top-up Loan** - Additional on existing loan

**Pre-Calculation**
Before applying, calculate:
- EMI affordability (max 40% of income)
- Total interest cost
- Processing fees
- Insurance costs

**Tips for Approval**
1. Improve credit score
2. Reduce existing debts
3. Choose property in approved list
4. Have proper documentation
5. Apply for realistic amount

**Alternative Financing**
- Developer payment plans
- Owner financing (rare)
- Peer-to-peer (emerging)

Smart financing makes property ownership achievable. Plan carefully!`
  },
  {
    title: "Common Mistakes to Avoid When Buying Property in Bangladesh",
    slug: "common-mistakes-buying-property-bangladesh",
    excerpt: "Learn from others' mistakes to ensure your property purchase goes smoothly and successfully.",
    content: `Property buying mistakes can be costly. Here's what to avoid:

**1. Skipping Legal Verification**
Never skip:
- Title search
- Document verification
- Encumbrance check
- Surveyor's verification

**2. Ignoring Hidden Costs**
Budget for:
- Registration: 4-5%
- Legal: 1-2%
- Renovation: 10-30%
- Maintenance fund
- Furnishing

**3. Emotional Decision-Making**
Don't:
- Rush due to "limited time"
- Buy based on show flat
- Ignore negative points
- Trust verbally

**4. Not Doing Market Research**
Compare:
- Prices in similar areas
- Rental yields
- Price appreciation history
- Development plans

**5. Overlooking Location Issues**
Check:
- Flood history
- Noise levels
- Traffic patterns
- Future construction plans
- neighborhood quality

**6. Ignoring Property Condition**
Always inspect:
- Structural integrity
- Waterproofing
- Electrical systems
- Plumbing
- Natural light

**7. Not Verifying Developer**
Research:
- Previous projects
- Financial stability
- Legal compliance
- Customer reviews

**8. Skipping Professional Help**
Engage:
- Property lawyer
- Architect for inspection
- Real estate advisor

**9. Ignoring Future Plans**
Consider:
- Family expansion
- Job location changes
- Resale potential

**10. Not Reading Documents**
Read every document carefully. Don't sign until you understand everything.

The right property at the right price with proper due diligence leads to stress-free ownership.`
  },
  {
    title: "Renting vs. Buying: Making the Smart Financial Choice in Bangladesh",
    slug: "renting-vs-buying-smart-choice-bangladesh",
    excerpt: "Is renting better or buying? Analyze the financial implications for your specific situation.",
    content: `The rent vs. buy debate is common. Here's how to decide for your situation in Bangladesh:

**When Renting Makes Sense**

*Advantages:*
- Lower upfront cost
- Flexibility to move
- No maintenance responsibility
- Lower commitment

*Ideal For:*
- Short-term assignments
- Uncertain job location
- Starting careers
- Testing an area

*Financial Reality:*
- Rent money = lost investment
- No equity building
- Rent increases annually

**When Buying Makes Sense**

*Advantages:*
- Build equity
- Tax benefits
- Asset appreciation
- Freedom to customize

*Ideal For:*
- Long-term settlement (5+ years)
- Stable income
- Family formation
- Investment mindset

*Financial Reality:*
- EMI may equal or slightly exceed rent
- Equity builds over time
- Property typically appreciates

**Key Calculations**

*Rent vs. Buy Formula:*
- If rent-to-price ratio < 5%: Buy
- If rent-to-price ratio > 8%: Rent
- Consider opportunity cost of down payment

**Hidden Factors**
- Rent: No ownership benefit, flexible
- Buy: Forced savings, stability, potential income

**Market Reality in Dhaka**
- Property prices: Rising 10-15% annually
- Rent increases: 5-8% annually
- Typical rent for ৳1 crore property: ৳25,000-40,000/month

**Expert Recommendation**
- Plan to stay 5+ years: Buy
- Plan to stay <3 years: Rent
- Uncertain: Rent initially, buy later

Make the choice that aligns with your life stage and financial goals.`
  },
  {
    title: "Property Maintenance: Essential Guide for Bangladeshi Homeowners",
    slug: "property-maintenance-essential-guide",
    excerpt: "Learn how to maintain your property's value through proper maintenance practices in Bangladesh's climate.",
    content: `Regular maintenance preserves property value and prevents costly repairs. Here's your guide:

**Seasonal Maintenance**

*Monsoon Preparation (April-June)*
- Check roof waterproofing
- Clean drainage systems
- Inspect exterior walls
- Test electrical systems
- Stock emergency supplies

*Post-Monsoon (July-September)*
- Check for water damage
- Repair any leaks
- Clean gutters
- Dry out damp areas

*Winter (October-February)*
- Check heating systems
- Inspect windows/doors
- Paint touch-ups
- Deep clean

**Interior Maintenance**
- Monthly: AC filters, kitchen exhaust
- Quarterly: Electrical checks, plumbing inspection
- Bi-annually: Deep clean, pest control

**Exterior Maintenance**
- Annual: Building exterior, common areas
- Quarterly: Garden/landscaping
- Monthly: Entrance and lobby

**Common Issues in Bangladesh**
1. Dampness and mold - monsoon damage
2. Water tank cleaning - quarterly required
3. Lift maintenance - monthly for apartments
4. Generator servicing - monthly for buildings
5. Pest control - quarterly recommended

**Cost Estimates (Annual)**
- 1500 sq ft apartment: ৳30,000-50,000
- 2500 sq ft apartment: ৳50,000-80,000
- Independent house: ৳80,000-1,50,000

**Maintenance Tips**
1. Create maintenance fund (1-2% of value annually)
2. Document all work done
3. Build relationships with reliable contractors
4. Address problems immediately
5. Keep spare parts available

**Professional Services**
- Property management companies
- Facility management services
- Individual contractors

Preventive maintenance saves money in the long run and keeps your property valuable.`
  },
  {
    title: "Smart Homes: The Future of Living in Bangladesh",
    slug: "smart-homes-future-living-bangladesh",
    excerpt: "Discover how smart home technology is transforming living spaces across Dhaka and Bangladesh.",
    content: `Smart homes are no longer luxury—they're the future. Here's what's available in Bangladesh:

**Available Technologies**

*Lighting Control*
- App-controlled switches
- Motion sensors
- Timed lighting
- Voice control (Alexa, Google)

*Security Systems*
- CCTV cameras
- Smart locks
- Doorbell cameras
- Motion detectors
- App notifications

*Climate Control*
- Smart AC controllers
- WiFi thermostats
- Remote fan control

*Entertainment*
- Smart TVs
- Multi-room audio
- Streaming integration

**Popular Packages**
1. Basic: Smart lights + security camera - ৳30,000-50,000
2. Intermediate: + smart locks + AC control - ৳80,000-1,50,000
3. Advanced: Full automation - ৳2,00,000+

**Brands Available**
- TP-Link
- Xiaomi
- Google Nest
- Amazon Echo
- Local installers

**Benefits**
- Convenience
- Energy savings (20-30%)
- Security enhancement
- Remote monitoring
- Value addition (5-10%)

**Considerations**
- Internet reliability needed
- Learning curve for users
- Initial investment
- Technical support availability

**Future Trends**
- AI-powered systems
- Energy monitoring
- Predictive maintenance
- Voice-first interfaces

**Installation Tips**
1. Start with basics
2. Ensure strong WiFi
3. Use professional installers
4. Plan for expansion
5. Have backup systems

Smart homes are becoming standard in new constructions. Consider integration during property purchase.`
  },
  {
    title: "Understanding Property Valuation: How to Know Fair Market Price",
    slug: "property-valuation-fair-market-price",
    excerpt: "Learn how property valuation works in Bangladesh and how to determine fair market price.",
    content: `Knowing property value helps in buying, selling, and financing. Here's how valuation works:

**Valuation Methods**

*1. Sales Comparison*
Compare with recent sales in the same area. Most common method.

*2. Income Approach*
For rental properties: Value = Annual Rent × Capitalization Rate

*3. Cost Approach*
Value = Land Value + Building Cost - Depreciation

**Key Factors Affecting Value**

*Location (40%)*
- Neighborhood prestige
- Proximity to amenities
- Transport connectivity
- Future development

*Property Condition (25%)*
- Age and maintenance
- Structural integrity
- Renovations done
- Overall presentation

*Market Conditions (20%)*
- Supply/demand balance
- Economic factors
- Interest rates
- Government policies

*Property Characteristics (15%)*
- Size and layout
- Floor level
- View and direction
- Amenities offered

**How to Estimate Value**

*Quick Formula:*
- Gulshan/Banani: ৳4,000-6,000 per sq ft
- Dhanmondi: ৳3,500-5,000 per sq ft
- Uttara: ৳2,500-4,000 per sq ft
- Mirpur: ৳2,000-3,500 per sq ft

*Adjustments:*
- New construction: +10-15%
- Floor level (higher=more)
- Corner position: +5-10%
- Renovated: +5-15%

**Getting Professional Valuation**
- Bank appraisers (for loans)
- Property consultants
- Real estate agents

**Red Flags**
- Over-inflated prices
- Manipulation of comparables
- Ignoring market data
- Pressure tactics

**Tools Available**
- Online property portals
- Government land valuation rates
- Recent transaction data

Knowledge is power in property transactions. Always verify valuations independently.`
  },
  {
    title: "Negotiation Tips: How to Get the Best Deal on Property",
    slug: "negotiation-tips-best-deal-property",
    excerpt: "Master the art of property negotiation to save money and get favorable terms.",
    content: `Negotiation can save lakhs. Here's how to do it effectively:

**Before Negotiation**

*Research Thoroughly*
- Know market prices
- Understand seller motivation
- Identify unique selling points
- Prepare your BATNA (Best Alternative)

**Negotiation Strategies**

*1. Start Low*
Initial offer 10-15% below target
Creates room for movement
Shows seriousness

*2. Use Facts*
Reference comparable properties
Point out defects
Highlight market trends
Show documentation

*3. Identify Motivations*
Cash buyers get discounts
Quick closings save money
Motivated sellers = better deals

*4. Multiple Properties*
Never show exclusive interest
Creates leverage
Enables comparison

**What to Negotiate**
- Price (main item)
- Payment terms
- Furniture inclusion
- Closing timeline
- Repair responsibilities

**Avoid During Negotiation**
- Emotional attachment
- Revealing your budget
- Rushing the process
- Lying about intentions

**When to Walk Away**
- Seller won't move on price
- Unexplained delays
- Document issues
- Pressure tactics

**Professional Help**
Real estate agents (1-2% commission) can:
- Handle negotiations
- Provide market expertise
- Manage paperwork
- Reduce emotional involvement

**Closing the Deal**
- Get everything in writing
- Define clear timelines
- Include contingencies
- Have lawyer review

Patience and preparation win negotiations. Don't be afraid to walk away.`
  },
  {
    title: "Title Deed Types and Legal Implications in Bangladesh",
    slug: "title-deed-types-legal-implications-bangladesh",
    excerpt: "Understanding different types of title deeds and their legal implications for property buyers.",
    content: `Not all title deeds are equal. Understanding them protects your investment:

**Types of Title Deeds**

*1. Original Title (অনাবাদি)*
- Direct inheritance/purchase from first owner
- Cleanest title
- Preferred for purchase

*2. Inheritance Title (উত্তরাধিকার)*
- Acquired through succession
- Requires mutation
- Verify all heirs

*3. Mutation Title (মিউটেশন)*
- Only shows current possessor
- Not proof of ownership
- Verify further back

*4. Registered Deed (নিবন্ধিত দলিল)*
- Properly registered at sub-registry
- Most secure for buyers
- Verifiable at record room

*5. Power of Attorney (অনুমোদনপত্র)*
- Not a title transfer
- Can be revoked
- Risky for buyers

**Risk Levels**
Low Risk:
- Original registered deed
- Clear chain of ownership
- Recent transactions

Medium Risk:
- Inheritance with all documents
- Mutation complete

High Risk:
- Power of Attorney
- Unverified documents
- Multiple owners

**Verification Process**
1. Check at Sub-Registry
2. Verify chain of ownership
3. Ensure no legal disputes
4. Confirm no encumbrances

**Red Flags**
- Incomplete documents
- Multiple owners disagreeing
- Pending court cases
- Missing links in chain
- Pressure to close quickly

**Expert Help Required**
- Property lawyer for verification
- Advocate for title search
- Surveyor for boundary confirmation

A clear title is worth the extra effort. Never compromise on legal verification.`
  },
  {
    title: "Floor Selection Guide: Which Floor is Right for You?",
    slug: "floor-selection-guide-right-floor",
    excerpt: "Pros and cons of different floor levels in apartment buildings in Bangladesh.",
    content: `Floor choice affects lifestyle, value, and resale. Here's your guide:

**Ground Floor (G)**
*Pros:*
- Easy access
- Garden access possible
- No elevator dependency
- Lower maintenance cost

*Cons:*
- Security concerns
- Privacy issues
- Noise from outside
- Pest problems
- Less natural light

*Best for:* Elderly, families with young children

**1st-3rd Floor**
*Pros:*
- Easy evacuation in emergencies
- Good for elderly
- Lower price than upper floors

*Cons:*
- Still affected by outside noise
- Security concerns
- Less privacy

*Best for:* Families with elderly members

**4th-10th Floor (Mid)**
*Pros:*
- Good views
- Better ventilation
- Less outside noise
- Popular choice

*Cons:*
- Elevator dependency
- Higher price

*Best for:* Most families

**11th-20th Floor (High)**
*Pros:*
- Best views
- Maximum natural light
- Better air quality
- Lower noise

*Cons:*
- Highest prices
- Elevator critical
- Evacuation challenges

*Best for:* Views priority, young couples

**Top Floor (Penthouse)**
*Pros:*
- Exclusive feel
- Maximum privacy
- Best views
- Rooftop access possible

*Cons:*
- Most expensive
- Heat issues
- Water pressure problems
- Maintenance challenges

*Best for:* Luxury seekers, empty nesters

**Resale Value Impact**
- Middle floors: Best resale
- Top floors: Premium for penthouses
- Ground floor: Lower resale value

**Bangladesh-Specific Considerations**
- Monsoon flooding: Consider elevation
- Power cuts: Ground floor practical
- Heat: Upper floors warmer
- Water pressure: Top floors may struggle

Choose based on lifestyle needs and long-term plans.`
  },
  {
    title: "Understanding Service Charges and Common Area Maintenance in Apartments",
    slug: "service-charges-common-area-maintenance-apartments",
    excerpt: "Everything about service charges, maintenance fees, and managing apartment common areas.",
    content: `Service charges affect your monthly budget. Understanding them ensures fair contributions:

**What's Typically Covered**
- Security guards
- Cleaning services
- Lift maintenance
- Generator operation
- Garden/landscape care
- Swimming pool (if available)
- Gym maintenance
- Common area electricity
- Waste management

**Cost Structure in Dhaka**

| Building Type | Monthly Charge (per sq ft) |
|--------------|---------------------------|
| Standard | ৳3-5 |
| Mid-range | ৳5-8 |
| Premium | ৳8-15 |
| Luxury | ৳15-25 |

**Additional Costs**
- One-time: Sinking fund (1-2 months)
- Emergency repairs
- Major renovations
- Insurance

**Calculation Example**
1500 sq ft apartment in mid-range building:
- Service charge: 1500 × ৳6 = ৳9,000/month
- Annual: ৳1,08,000

**Factors Affecting Charges**
- Building age
- Amenities offered
- Staff quality
- Energy costs
- Maintenance requirements

**Owner's Responsibilities**
- Pay on time
- Attend society meetings
- Follow building rules
- Report issues promptly

**What to Check Before Buying**
- Review past 2 years of accounts
- Verify reserve fund status
- Check for special assessments
- Understand fee increase mechanism

**Red Flags**
- No transparent accounting
- Inadequate reserves
- Disputed service charges
- Poor maintenance despite fees

**Your Rights**
- Transparent account access
- Participate in decisions
- Vote on major expenses
- Quality services for fees paid

Quality maintenance protects your property value. Choose buildings with well-managed service charges.`
  },
  {
    title: "Property Insurance: What Bangladeshi Homeowners Need to Know",
    slug: "property-insurance-bangladesh",
    excerpt: "Protect your investment with appropriate insurance coverage. Here's what's available in Bangladesh.",
    content: `Insurance protects your property investment. Here's what's available in Bangladesh:

**Types of Property Insurance**

*1. Fire Insurance*
- Mandatory for bank loans
- Covers fire, lightning, explosion
- Add-on: Flood coverage
- Add-on: Earthquake (optional)

*2. Property All-Risk*
- Comprehensive coverage
- Covers more perils
- Higher premium, more protection

*3. Public Liability*
- Third-party injury claims
- Visitor accidents

*4. Burglary Insurance*
- Theft coverage
- Contents insurance
- May require security systems

**Coverage Amounts**
- Building: Property value
- Contents: Estimated value
- Liability: ৳5-50 lakh typical

**Premium Rates (Annual)**
- Fire only: 0.3-0.5% of value
- All-risk: 0.8-1.2% of value

**What's NOT Covered**
- Normal wear and tear
- Deliberate damage
- War/nuclear risks
- Uninsured perils in policy
- Negligence

**Claims Process**
1. Inform immediately
2. Document damage
3. File police report (if theft)
4. Submit claim form
5. Provide evidence
6. Assessment by surveyor
7. Claim settlement

**Popular Providers in Bangladesh**
- PBL Insurance
- Green Delta Insurance
- Paramount Insurance
- Pragati Insurance
- Eastern Bank Insurance

**Tips for Claims**
- Read policy carefully
- Maintain documentation
- Report promptly
- Follow procedures exactly

**Bank Requirements**
Most banks require:
- Fire insurance (mandatory)
- Property to be insured
- Bank as loss payee

**Assessment Before Buying**
1. Evaluate risk factors
2. Compare premiums
3. Check claim settlement record
4. Understand exclusions
5. Consider required vs. optional

Insurance gives peace of mind. At minimum, get fire insurance with flood add-on.`
  },
  {
    title: "Property Documentation: The Complete Checklist for Buyers",
    slug: "property-documentation-complete-checklist",
    excerpt: "Essential documents to verify before purchasing property in Bangladesh.",
    content: `Proper documentation is non-negotiable. Here's your complete checklist:

**Ownership Documents**
- [ ] Title Deed (original)
- [ ] Mutation certificate
- [ ] Khatiyan (Land Records)
- [ ] CS/RS/SA Porcha
- [ ] DCR (if applicable)
- [ ] Plot plan/building plan

**Legal Documents**
- [ ] No Objection Certificate
- [ ] Encumbrance certificate
- [ ] Court clearance (if any)
- [ ] Release deed (if applicable)
- [ ] Power of Attorney (if used)

**Financial Documents**
- [ ] Tax clearance certificate
- [ ] Utility bill clearance (last 3 years)
- [ ] Service charge clearance
- [ ] Parking allocation (if applicable)

**Property Documents**
- [ ] Occupancy Certificate
- [ ] Building completion Certificate
- [ ] Fire safety certificate (if applicable)
- [ ] Environmental clearance
- [ ] RAJUK approval (for Dhaka)

**Verification Checklist**
1. Verify title at Sub-Registry
2. Cross-check khatiyan
3. Confirm no pending cases
4. Check tax payment status
5. Validate building plan
6. Confirm no violation

**Documents for Different Properties**

*New Construction:*
- Builder/developer documents
- Project registration
- Allotment letter
- Payment receipts

*Resale Property:*
- All original documents
- Chain of titles
- Seller ID verification

*Inherited Property:*
- Heir certificate
- Legal heirship documents
- Mutation completion

**What to Watch For**
- Photocopies vs originals
- Stamped vs unstamped
- Dated and signed properly
- Consistent names throughout

**Professional Help**
Engage:
- Property lawyer
- Advocate for verification
- Surveyor for boundary
- Valuer for pricing

Never proceed without verifying all documents. This investment is too significant to skip due diligence.`
  },
  {
    title: "First-Time Buyer Guide: Everything You Need to Know Before Buying",
    slug: "first-time-buyer-guide-complete",
    excerpt: "A comprehensive guide for first-time property buyers in Bangladesh covering everything from budgeting to closing.",
    content: `Buying your first home is exciting but overwhelming. This guide covers everything:

**Step 1: Financial Planning**
- Check credit score
- Calculate affordable EMI
- Save for down payment (20-30%)
- Budget for closing costs (5-7%)

**Step 2: Determine Needs**
- Family size now and future
- Location priorities
- Property type preferences
- Must-have features

**Step 3: Property Search**
- Research areas
- Visit multiple properties
- Use online portals
- Engage agents carefully

**Step 4: Property Evaluation**
- Structural condition
- Legal verification
- Location pros/cons
- Resale potential

**Step 5: Offer and Negotiation**
- Make conditional offer
- Negotiate terms
- Fix timeline
- Define contingencies

**Step 6: Legal Process**
- Engage lawyer
- Document verification
- Title search
- Draft agreement

**Step 7: Financing**
- Apply for loan
- Provide documentation
- Loan approval
- Disbursement process

**Step 8: Registration**
- Pay stamp duty
- Register property
- Complete mutation
- Update records

**First-Time Buyer Mistakes to Avoid**
1. Buying beyond budget
2. Skipping legal verification
3. Not inspecting multiple times
4. Ignoring hidden costs
5. Rushing decision
6. Not comparing options
7. Emotional over rational

**Essential Numbers to Know**
- Down payment: 20-30%
- Bank loan: 70-80%
- Registration: 4-5%
- Legal: 1-2%

**Questions to Ask**
- Why is seller selling?
- How long on market?
- Any issues with property?
- What's included in price?
- Neighbors like living there?

**Expert Tips**
1. Get pre-approval for loan
2. Include inspection contingency
3. Read all documents
4. Don't skip property inspection
5. Verify all details independently

Your first home should be a blessing, not a burden. Plan carefully!`
  },
  {
    title: "Understanding Utility Connections: Electricity, Gas, and Water in Properties",
    slug: "utility-connections-electricity-gas-water",
    excerpt: "Everything about transferring and setting up utility connections when buying property in Bangladesh.",
    content: `Utility connections are essential for comfortable living. Here's the guide:

**Electricity Connection**

*Existing Property:*
- Request transfer in writing
- Submit owner ID documents
- Pay outstanding bills
- Meter transfer process (2-4 weeks)

*New Connection:*
- Apply to DESCO/WZPDCL
- Submit documents
- Pay connection fee (৳500-5000)
- Installation (4-8 weeks)

*Capacity Planning:*
- 2BHK: 3-5 kW
- 3BHK: 5-7.5 kW
- 4BHK+: 7.5-10 kW

**Gas Connection**

*Existing:*
- Transfer application to TGTDCL
- Submit ownership proof
- Pay transfer fee
- 2-4 weeks process

*New:*
- Apply with project approval
- Limited availability
- Long waiting period

*Tips:*
- Verify active connection
- Check meter reading
- No outstanding bills

**Water Connection**

*DWASA (Dhaka):*
- Apply for new connection
- Pay development fee
- Installation charge (৳10,000-50,000)
- May take 2-6 months

*Transfer:*
- Submit ownership documents
- Pay transfer fee
- 1-2 weeks

**Costs to Budget**
- Electricity: ৳5,000-50,000
- Gas: ৳10,000-1,00,000 (limited)
- Water: ৳20,000-1,00,000

**Essential Documents**
- Ownership deed copy
- National ID
- Tax payment receipt
- Occupancy certificate

**Pre-Purchase Checks**
- All utilities active?
- Bills cleared?
- Meter functioning?
- No pending transfers?
- Correct name on accounts?

**Red Flags**
- Disconnected utilities
- Illegal connections
- Outstanding bills
- Meter tampering history

**Time to Process**
- Electricity: 1-4 weeks
- Gas: 2-8 weeks
- Water: 1-6 months

Get all utility transfers done in your name before moving in.`
  },
  {
    title: "Bangladeshi Real Estate Market Analysis: 2026 Opportunities",
    slug: "bangladeshi-real-estate-market-analysis-2026",
    excerpt: "Analysis of current market conditions and investment opportunities in Bangladesh real estate for 2026.",
    content: `The Bangladeshi real estate market continues to evolve. Here's the 2026 analysis:

**Market Overview**

*Growth Indicators:*
- 10-15% annual price appreciation
- 6-8% rental yields
- 20%+ growth in new projects
- Increased foreign interest

**Key Drivers**
- GDP growth (6%+ annually)
- Urbanization acceleration
- Middle-class expansion
- Infrastructure development

**Hot Locations 2026**

*Premium Segment:*
- Gulshan-Banani corridor
- Baridhara diplomatic zone
- Dhanmondi central

*Growth Segment:*
- Purbachal new city
- Uttara extension
- Badda Innovation Hub
- Keraniganj riverfront

*Value Segment:*
- Savar industrial area
- Gazipur residential
- Narayanganj

**Sector Analysis**

*Residential:*
- Strong demand, prices rising
- Premium segment: High inventory
- Mid-range: Best demand
- Affordable: Government focus

*Commercial:*
- Office space: Growing demand
- Retail: New malls performing well
- Warehouse: E-commerce boom

*Industrial:*
- Manufacturing: Growing
- Logistics: Hot sector
- Food processing: Emerging

**Investment Opportunities**
1. Transit-oriented properties (Metro stations)
2. Water-front developments
3. Mixed-use projects
4. Affordable housing
5. Commercial租赁

**Risk Factors**
- Interest rate fluctuations
- Material cost inflation
- Regulatory changes
- Economic slowdown

**Expert Predictions**
- Continued growth 10-15%
- Premium correction possible
- Mid-range stable
- Affordable: Government boost

**Strategic Recommendations**
- Buy in growth corridors
- Focus on transit proximity
- Consider rental income
- Hold 5+ years minimum
- Diversify locations

**Areas to Avoid**
- Flood-prone zones
- Unapproved projects
- Over-hyped speculative areas
- Illegal developments

The market remains bullish. Strategic buying with proper due diligence will yield good returns.`
  },
  {
    title: "Understanding RERA and Property Regulations in Bangladesh",
    slug: "rera-property-regulations-bangladesh",
    excerpt: "Stay compliant with property laws and regulations in Bangladesh. Learn about RERA and other legal frameworks.",
    content: `Property laws protect buyers and sellers. Here's what you need to know:

**RERA (Real Estate Regulatory Authority)**

*Status:* Proposed and under discussion
*Purpose:* Regulate developers
*Expected:* More consumer protection

**Current Regulations**

*1. Development Rules*
- RAJUK (Dhaka)
- CDA (Chittagong)
- KDA (Khulna)
- LDA (Rajshahi)

*Requirements for Developers:*
- Project registration
- Progress reporting
- Escrow accounts (proposed)
- Quality standards

*2. Building Codes*
- Bangladesh National Building Code (BNBC)
- Fire safety regulations
- Environmental clearances
- Structural safety

**Consumer Protection Laws**

*Right to Information:*
- Project details
- Financial status
- Completion timeline
- Legal status

*Dispute Resolution:*
- Consumer court
- Civil court
- Alternative dispute resolution

**What Regulations Cover**
- Project approval
- Construction standards
- Marketing practices
- Contract terms
- Delivery timelines

**Compliance Checklist for Buyers**
- Verify RAJUK approval
- Check building permit
- Confirm all clearances
- Review contract terms
- Document everything

**Developers' Obligations**
- Complete as promised
- Quality construction
- On-time delivery
- Proper documentation

**Penalties for Violations**
- Project cancellation
- Financial penalties
- Legal action
- Blacklisting

**Buyer Due Diligence**
1. Check project approval status
2. Verify builder's track record
3. Review all contracts
4. Ensure proper documentation
5. Register complaints properly

**Industry Changes Expected**
- Mandatory escrow accounts
- Project completion insurance
- Quality certifications
- Regular audits

Stay informed and work with compliant developers to protect your investment.`
  }
];

async function main() {
  console.log('Starting seed...');
  
  // Clean existing data
  await prisma.transaction.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.property.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.user.deleteMany();

  // Create admin
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@luxespace.com',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+8801711111111',
    },
  });
  console.log('Admin created');

  // Create agents
  const agentNames = ['Rahim Khan', 'Sanjay Kumar', 'Mahfuz Ahmed'];
  const agents = [];
  for (let i = 0; i < 3; i++) {
    const agentPassword = await bcrypt.hash('Agent@123', 12);
    const agent = await prisma.user.create({
      data: {
        name: agentNames[i],
        email: `agent${i + 1}@luxespace.com`,
        password: agentPassword,
        role: 'AGENT',
        phone: `+88017${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + i * 10000000}?w=200`,
      },
    });
    agents.push(agent);
  }
  console.log('3 Agents created');

  // Create users
  const users = [];
  for (let i = 0; i < 10; i++) {
    const userPassword = await bcrypt.hash('User@123', 12);
    const user = await prisma.user.create({
      data: {
        name: `User ${i + 1}`,
        email: `user${i + 1}@luxespace.com`,
        password: userPassword,
        role: 'USER',
        phone: `+88019${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      },
    });
    users.push(user);
  }
  console.log('10 Users created');

  // Create 30 properties
  const propertyAmenities = [
    ['Swimming Pool', 'Gym', 'Parking', '24/7 Security', 'Generator', 'Lift'],
    ['Parking', 'Security', 'CCTV', 'Lift', 'Generator'],
    ['Swimming Pool', 'Gym', 'Garden', 'Children Play Area', 'Security'],
    ['Parking', 'Security', 'Fire Exit', 'CCTV', 'Lift'],
    ['Swimming Pool', 'Gym', 'Parking', 'Club House', 'Security'],
  ];

  for (let i = 0; i < 30; i++) {
    const property = properties[i];
    const agent = agents[i % agents.length];
    const imageIndex = i % realPropertyImages.length;
    const amenityIndex = i % propertyAmenities.length;
    
    await prisma.property.create({
      data: {
        title: property.title,
        description: `Beautiful ${property.bhk > 0 ? property.bhk + ' BHK ' : ''}${property.type} located in ${property.location}, Dhaka. This property offers ${property.size} sq ft of well-designed living space with modern amenities and excellent connectivity to major parts of the city. Perfect for families looking for a comfortable and luxurious lifestyle.`,
        price: property.price,
        location: property.location,
        city: 'Dhaka',
        area: `${property.location}, Dhaka`,
        bhk: property.bhk,
        size: property.size,
        type: property.type,
        images: [
          realPropertyImages[imageIndex],
          realPropertyImages[(imageIndex + 1) % realPropertyImages.length],
          realPropertyImages[(imageIndex + 2) % realPropertyImages.length],
        ],
        amenities: propertyAmenities[amenityIndex],
        status: 'AVAILABLE',
        isFeatured: i < 10,
        agentId: agent.id,
      },
    });
  }
  console.log('30 Properties created');

  // Create 30 blogs
  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i];
    await prisma.blog.create({
      data: {
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content,
        coverImage: realBlogImages[i % realBlogImages.length],
        category: ['Real Estate', 'Investment', 'Tips', 'Market', 'Lifestyle', 'Guide', 'News'][i % 7],
        authorId: admin.id,
        isPublished: true,
      },
    });
  }
  console.log(`${blogs.length} Blogs created`);

  // Create settings
  await prisma.settings.create({
    data: {
      siteName: 'LuxeSpace',
      heroTitle: 'Discover Your Dream Property',
      heroSubtitle: "Bangladesh's Premier Luxury Real Estate Platform",
    },
  });

  console.log('\n✅ Seed completed successfully!');
  console.log('\n📋 Login Credentials:');
  console.log('   Admin: admin@luxespace.com / Admin@123');
  console.log('   Agent: agent1@luxespace.com / Agent@123');
  console.log('   User: user1@luxespace.com / User@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });