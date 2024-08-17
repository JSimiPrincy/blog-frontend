// comment.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommentService } from './comment.service'; // Adjust the import path as needed

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:4040/api/comments'; // This should match the apiUrl in your service

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentService]
    });

    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createComment', () => {
    it('should create a comment and return response', () => {
      const postId = '123';
      const content = 'This is a comment';
      const mockResponse = { success: true };

      service.createComment(postId, content).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ content, postId });
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${localStorage.getItem('token')}`);
      req.flush(mockResponse);
    });
  });

  describe('getCommentsByPost', () => {
    it('should return comments for the given postId', () => {
      const postId = '123';
      const mockComments = [{ id: '1', content: 'First comment' }, { id: '2', content: 'Second comment' }];

      service.getCommentsByPost(postId).subscribe(comments => {
        expect(comments).toEqual(mockComments);
      });

      const req = httpMock.expectOne(`${apiUrl}/post/${postId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockComments);
    });
  });
});
