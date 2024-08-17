export interface Comment {
    _id?: string;
    content: string;
    author: {
      _id: string;
      username: string;
    };
    post: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  