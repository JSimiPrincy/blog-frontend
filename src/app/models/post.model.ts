export interface Post {
    _id: string;
    title: string;
    content: string;
    author: {
      id: string;
      username: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
  }
  