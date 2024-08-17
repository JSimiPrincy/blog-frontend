import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { Component } from '@angular/core'; // Import Component

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterComponent, MockLoginComponent ], // Declare Mock Component here
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: MockLoginComponent } // Mock component for login route
        ]),
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [ AuthService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call register on form submit', () => {
    spyOn(authService, 'register').and.returnValue(of({}));

    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(authService.register).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123');
  });

  it('should handle registration errors', () => {
    spyOn(authService, 'register').and.returnValue(throwError(() => new Error('Registration failed')));

    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(authService.register).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123');
    // Add assertions to verify error handling, e.g., error logging
  });

  it('should navigate to login on successful registration', () => {
    spyOn(authService, 'register').and.returnValue(of({}));
    spyOn(component['router'], 'navigate');

    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(component['router'].navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle form errors', () => {
    component.registerForm.setValue({
      username: '',
      email: '',
      password: ''
    });

    component.onSubmit();

    expect(authService.register).not.toHaveBeenCalled();
  });
});

// Mock component for login route
@Component({
  template: '<div>Mock Login</div>'
})
class MockLoginComponent {}
