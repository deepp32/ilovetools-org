const https = require('https');
const token = 'fWjJYUP02zLCuCQ_TVE7RKvyY3HN1LldL8fJUJk2hew';

const postData = JSON.stringify({
  query: `
    query {
      posts(order: NEWEST, first: 20) {
        edges {
          node {
            id
            name
            tagline
            slug
            votesCount
            commentsCount
            createdAt
            url
            user {
              username
            }
          }
        }
      }
    }
  `
});

const req = https.request('https://api.producthunt.com/v2/api/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token,
    'Content-Length': Buffer.byteLength(postData)
  }
}, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Posts returned:', parsed.data?.posts?.edges?.length);
      const filtered = parsed.data?.posts?.edges?.filter(e => e.node.user?.username === 'deep_gajera1' || e.node.name.toLowerCase().includes('ilovetools'));
      console.log('Filtered Posts:', JSON.stringify(filtered, null, 2));
    } catch (e) {
      console.log('Error parsing:', data);
    }
  });
});
req.write(postData);
req.end();
