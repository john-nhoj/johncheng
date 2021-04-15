import { fetchContentful } from './fetch';
import { postFields } from './schemas';

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
  return fetchContentful(query).then((res) => {
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
  return fetchContentful(query).then((res) => {
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
  return fetchContentful(query).then((res) => {
    return res.json();
  });
};

export const getBlogPostsList = () => {
  const query = `
  {
    blogPostCollection {
      items {
        title
        description
        publishDate
        heroImage {
          url
        }
        sys {
          id
        }
      }
    }
  }
  `;

  return fetchContentful(query).then((res) => {
    return res.json();
  });
};
