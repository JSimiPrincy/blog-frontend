// post.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostService } from './post.service';
import { Post } from '../models/post.model'; // Adjust path as needed

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:4040/api/posts';
  const mockToken = 'mockToken123'; // Mock token for Authorization header

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Import HttpClientTestingModule
      providers: [PostService]
    });

    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.setItem('token', mockToken); // Mock token in localStorage
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
    localStorage.removeItem('token'); // Clean up token after tests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPosts', () => {
    it('should return an Observable<Post[]>', () => {
      const mockPosts: Post[] = [
        {
          _id: '1',
          title: 'Post 1',
          content: 'Content 1',
          author: { id: '1', username: 'Author 1' }
        },
        {
          _id: '2',
          title: 'Post 2',
          content: 'Content 2',
          author: { id: '2', username: 'Author 2' }
        }
      ];

      service.getPosts().subscribe(posts => {
        expect(posts.length).toBe(2);
        expect(posts).toEqual(mockPosts);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockPosts);
    });
  });

  describe('getPost', () => {
    it('should return an Observable<Post>', () => {
      const mockPost: Post = {
        _id: '1',
        title: 'Post 1',
        content: 'Content 1',
        author: { id: '1', username: 'Author 1' }
      };
      const postId = '1';

      service.getPost(postId).subscribe(post => {
        expect(post).toEqual(mockPost);
      });

      const req = httpMock.expectOne(`${apiUrl}/${postId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPost);
    });
  });

  describe('createPost', () => {
    it('should return an Observable<Post>', () => {
      const newPost: Post = {
        _id: '3',
        title: 'Post 3',
        content: 'Content 3',
        author: { id: '3', username: 'Author 3' }
      };

      service.createPost(newPost).subscribe(post => {
        expect(post).toEqual(newPost);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      expect(req.request.body).toEqual(newPost);
      req.flush(newPost);
    });
  });

  describe('updatePost', () => {
    it('should return an Observable<Post>', () => {
      const updatedPost: Post = {
        _id: '1',
        title: 'Updated Post',
        content: 'Updated Content',
        author: { id: '1', username: 'Author 1' }
      };
      const postId = '1';

      service.updatePost(postId, updatedPost).subscribe(post => {
        expect(post).toEqual(updatedPost);
      });

      const req = httpMock.expectOne(`${apiUrl}/${postId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      expect(req.request.body).toEqual(updatedPost);
      req.flush(updatedPost);
    });
  });

  describe('deletePost', () => {
    it('should return an Observable<any>', () => {
      const postId = '1';

      service.deletePost(postId).subscribe(response => {
        expect(response).toBeNull(); // Expect no content on successful deletion
      });

      const req = httpMock.expectOne(`${apiUrl}/${postId}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush(null);
    });
  });
});

