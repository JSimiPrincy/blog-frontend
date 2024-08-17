import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostListComponent } from './post-list.component';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { RouterTestingModule } from '@angular/router/testing';

describe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;
  let httpMock: HttpTestingController;
  let postService: PostService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostListComponent ],
      imports: [ 
        HttpClientTestingModule,
        RouterTestingModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatListModule
      ],
      providers: [ PostService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostListComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests
  });

  it('should create', () => {
    const req = httpMock.expectOne('http://localhost:4040/api/posts');
    req.flush([]); // Respond with an empty array or mock data
    expect(component).toBeTruthy();
  });

  it('should make an HTTP request and get posts', () => {
    const mockPosts: Post[] = [{
      _id: '1',
      title: 'Test Post',
      content: 'This is a test post',
      author: {
        id: 'author1',
        username: 'AuthorName'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }];

    component.ngOnInit();
    
    const req = httpMock.expectOne('http://localhost:4040/api/posts');
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);

    fixture.detectChanges();
    expect(component.posts).toEqual(mockPosts);
  });

  it('should handle HTTP error', () => {
    const errorMessage = 'Failed to load posts';

    component.ngOnInit();

    const req = httpMock.expectOne('http://localhost:4040/api/posts');
    expect(req.request.method).toBe('GET');
    req.flush({ message: errorMessage }, { status: 500, statusText: 'Server Error' });

    fixture.detectChanges();
    
    // Add assertions to verify how the error is handled
    // For example, if you display an error message, check that it's present
    // const errorElement = fixture.debugElement.query(By.css('.error-message'));
    // expect(errorElement.nativeElement.textContent).toContain(errorMessage);
  });
});
