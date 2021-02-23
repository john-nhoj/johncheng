import { createClient } from 'contentful';

const { CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_SPACE_ID } = process.env;

if (!CONTENTFUL_ACCESS_TOKEN || !CONTENTFUL_SPACE_ID) {
  console.error('Contentful environment variables are missing.');
}

const client = createClient({
  accessToken: CONTENTFUL_ACCESS_TOKEN,
  space: CONTENTFUL_SPACE_ID,
});

export { client };
