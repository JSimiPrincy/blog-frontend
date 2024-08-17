import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {
  postForm: FormGroup;
  isEditMode = false;
  postId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id');
    if (this.postId) {
      this.isEditMode = true;
      this.loadPost(this.postId);
    }
  }

  loadPost(id: string) {
    this.postService.getPost(id).subscribe(
      (post) => {
        this.postForm.patchValue(post);
      },
      (error) => {
        console.error('Error loading post', error);
      }
    );
  }

  onSubmit() {
    if (this.postForm.valid) {
      if (this.isEditMode) {
        this.postService.updatePost(this.postId!, this.postForm.value).subscribe(
          () => {
            this.router.navigate(['/posts']);
          },
          (error) => {
            console.error('Error updating post', error);
          }
        );
      } else {
        this.postService.createPost(this.postForm.value).subscribe(
          () => {
            this.router.navigate(['/posts']);
          },
          (error) => {
            console.error('Error creating post', error);
          }
        );
      }
    }
  }
}
