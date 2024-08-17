import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { CommentService } from '../../services/comment.service';
import { Post } from '../../models/post.model';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  post: Post | null = null;
  comments: Comment[] = [];
  commentForm: FormGroup;
  showCommentForm = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private postService: PostService,
    private commentService: CommentService
  ) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPost(id);
      this.loadComments(id);
    }
  }

  loadPost(id: string) {
    this.postService.getPost(id).subscribe(
      (post) => this.post = post,
      (error) => {
        console.error('Error creating comment', error);
      }
    );
  }

  loadComments(postId: string) {
    this.commentService.getCommentsByPost(postId).subscribe(
      comments => this.comments = comments,
      error => console.error('Error loading comments:', error)
    );
  }

  toggleCommentForm() {
    this.showCommentForm = !this.showCommentForm;
  }

  onSubmitComment() {
    if (this.commentForm.valid && this.post) {
      
      this.commentService.createComment(this.post._id,this.commentForm.value.content).subscribe(
        newComment => {
          this.comments.unshift(newComment);
          this.commentForm.reset();
          this.showCommentForm = false;
        },
        (error) => {
          console.error('Error creating comment', error);
        }
      );
    }
  }
}
