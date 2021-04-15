export interface Post {
  title: string;
  description: string;
  publishDate: Date;
  heroImage: {
    url: string;
  };
  sys: {
    id: string;
  };
}
