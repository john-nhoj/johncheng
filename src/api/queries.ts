import { postFields } from './schemas';

const { CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_SPACE_ID } = process.env;

export const getPost = (slug: string) => {
  const query = `
  {
    blogPostCollection(where: {slug: "${slug}"}, limit: 1) {
      items {
        ${postFields}
      }
    }
  }
  `;
  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    }
  ).then((res) => {
    return res.json();
  });
};

export const getAuthor = (id: string) => {
  const query = `
  {
    person(id: "${id}") {
      name
    }
  }
  `;
  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    }
  ).then((res) => {
    return res.json();
  });
};

export const getAllBlogPostsSlugs = () => {
  const query = `
  {
    blogPostCollection {
      items {
        slug
      }
    }
  }
  `;
  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    }
  ).then((res) => {
    return res.json();
  });
};
