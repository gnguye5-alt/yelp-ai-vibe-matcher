// Test to see what Yelp AI API actually returns
const YELP_API_KEY = process.env.YELP_API_KEY;

async function testYelpAI() {
  const response = await fetch('https://api.yelp.com/ai/chat/v2', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${YELP_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: 'Find me coffee shops in San Francisco',
      user_context: {
        locale: 'en_US',
        latitude: 37.7749,
        longitude: -122.4194
      }
    })
  });

  const data = await response.json();
  
  if (data.entities && data.entities[0]?.businesses) {
    const business = data.entities[0].businesses[0];
    console.log('Sample business structure:');
    console.log(JSON.stringify({
      name: business.name,
      is_closed: business.is_closed,
      hours: business.hours,
      // Show all keys
      allKeys: Object.keys(business)
    }, null, 2));
  }
}

testYelpAI().catch(console.error);
