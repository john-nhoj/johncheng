export interface Post {
  title: string;
  description: string;
  publishDate: Date;
  slug: string;
  heroImage: {
    url: string;
  };
  sys: {
    id: string;
  };
}
