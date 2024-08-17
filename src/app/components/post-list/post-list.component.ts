import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { CommentService } from '../../services/comment.service';
import { Post } from '../../models/post.model';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  commentForms: { [postId: string]: FormGroup } = {};
  comments: { [postId: string]: Comment[] } = {};
  showCommentForm: { [postId: string]: boolean } = {};
  showAllComments: { [postId: string]: boolean } = {}; // Track View More state

  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getPosts().subscribe(
      (posts) => {
        this.posts = posts;
        posts.forEach(post => {
          this.commentForms[post._id] = this.fb.group({
            content: ['', Validators.required]
          });
          this.loadComments(post._id);
        });
      },
      (error) => {
        console.error('Error fetching posts', error);
      }
    );
  }

  deletePost(postId: string) {
    this.postService.deletePost(postId).subscribe(
      () => {
        this.posts = this.posts.filter(post => post._id !== postId);
        delete this.commentForms[postId];
        delete this.comments[postId];
        delete this.showCommentForm[postId];
      },
      (error) => {
        console.error('Error deleting post', error);
      }
    );
  }

  loadComments(postId: string) {
    this.commentService.getCommentsByPost(postId).subscribe(
      (comments) => {
        this.comments[postId] = comments;
      },
      (error) => {
        console.error('Error fetching comments', error);
      }
    );
  }

  toggleCommentForm(postId: string) {
    this.showCommentForm[postId] = !this.showCommentForm[postId];
  }

  onSubmitComment(postId: string) {
    if (this.commentForms[postId].valid) {
      this.commentService.createComment(postId, this.commentForms[postId].value.content).subscribe(
        (newComment) => {
          if (!this.comments[postId]) {
            this.comments[postId] = [];
          }
          this.comments[postId].unshift(newComment);
          this.commentForms[postId].reset();
          this.showCommentForm[postId] = false;
        },
        (error) => {
          console.error('Error creating comment', error);
        }
      );
    }
  }

  toggleViewMore(postId: string) {
    this.showAllComments[postId] = !this.showAllComments[postId];
  }
}

