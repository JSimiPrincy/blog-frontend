import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'https://blog-backend-znln.onrender.com/api/comments';

  constructor(private http: HttpClient) {}

  createComment(postId: string, content: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.post(`${this.apiUrl}`, { content, postId }, { headers });
  }

  getCommentsByPost(postId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/post/${postId}`);
  }
}
