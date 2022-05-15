import { LocationService } from './../../services/location.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppCluster } from 'src/app/app.shared.cluster';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Store } from 'src/app/enum/store.enum';
import { ApiResponse } from 'src/app/models/api-response.model';
import { UserRequest } from 'src/app/models/user-request.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { StorageService } from 'src/app/services/storage.service';
import { FormValidator } from 'src/app/validators/form-custom.validator';
import { CategoryType } from 'src/app/enum/category-type.enum';
import { CategoryService } from 'src/app/services/category.service';
import { Title } from '@angular/platform-browser';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { Login } from 'src/app/models/login';
import { environment } from 'src/environments/environment';
import { LoginToken } from 'src/app/models/login-token';
import { UserRole } from 'src/app/enum/user-role.enum';
import { AccountType } from 'src/app/enum/account-type.enum';
import { AuthProvider } from 'src/app/enum/auth-provider.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  public isLoggedIn = false;
  public modalSize = 320;
  public user: SocialUser;
  public loggedIn: boolean;
  public socialUser: SocialUser
  public isVisible:Boolean =false
  previousUrl: string = null;
  currentUrl: string = null;
  form: FormValidator;
  app: AppCluster;
  userRequest = new UserRequest();

  constructor(
    private router: Router,
    private storage: StorageService,
    private titleService: Title,
    private categoryService: CategoryService,
    private locationService: LocationService,
    private authService: AuthenticationService,
    private socialAuthService: SocialAuthService,
    private notification: NotificationService
  ) {
    this.form = new FormValidator(UserRequest, 'form');
  }

  async getUser() {
    var userData = this.storage.get(Store.USER);
    if (userData != null) {
      var user = JSON.parse(userData);
      this.userRequest.username = user.mobile;
    }
  }

  async getProductCategories() {
    this.categoryService.getCategoriesByType(CategoryType.PRODUCT).subscribe(
      (response: ApiResponse) => {
        if (response.success) {
          if (response.payload != null)
            //store in session storage
            this.storage.saveSession(
              Store.CATEGORY,
              JSON.stringify(response.payload)
            );
          //store in local storage
          this.storage.save(Store.CATEGORY, JSON.stringify(response.payload));
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  async getLocations() {
    this.locationService.getLocations().subscribe(
      (response: ApiResponse) => {
        if (response.success) {
          if (response.payload != null)
            //store in session storegae
            this.storage.saveSession(
              Store.LOCATIONS,
              JSON.stringify(response.payload)
            );
          //store in local storage
          this.storage.save(Store.LOCATIONS, JSON.stringify(response.payload));
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  async signIn() {
    this.form.revalidate();
    let response = this.form.response;
    this.userRequest = this.form.data;
    if (response['username'].ok && response['password'].ok) {
      this.getProductCategories();
      this.getLocations();

      var loginRequest = new Login();
      loginRequest.username = this.userRequest.username
      loginRequest.password = this.userRequest.password
      loginRequest.grant_type = environment.grantType

      this.authService.signIn(loginRequest).subscribe(
        (token: LoginToken) => {

          if (token.access_token != null) {

            var signedUser = token as unknown as User;
            console.log(signedUser);
            this.storage.save(Store.TOKEN, token.access_token);
            this.storage.save(
              Store.USER,
              JSON.stringify(signedUser)
            );
            var returnURL = this.storage.get('returnURL');
            if (returnURL != null) {
              window.location.href = returnURL;
            } else {
              this.router.navigate(['/']);
            }
            console.log(this.authService.isAuthenticated);
          } else {
            this.notification.notifyError("Something Went Wrong!");
          }
        },
        (err) => {
          this.notification.notifyError(err);
        }
      );
    } else {
      this.notification.notifyWarning('Oops! form not filled correctly');
    }
  }


  signOn(login: Login) {
    this.authService.signIn(login).subscribe((token: LoginToken) => {
      if (token.access_token != null) {
        var signedUser = token as unknown as User;
        console.log(signedUser);
        this.storage.save(Store.TOKEN, token.access_token);
        this.storage.save(
          Store.USER,
          JSON.stringify(signedUser)
        );
        var returnURL = this.storage.get('returnURL');
        if (returnURL != null) {
          window.location.href = returnURL;
          this.storage.remove('returnURL')
        } else {
          this.router.navigate(['/']);
        }
      } else {
        this.notification.notifyError("Something Went Wrong!");
      }
    });
  }
  socialSignOn() {
    if (this.socialUser) {
      var login = new Login();
      login.username = this.socialUser.email;
      login.password = environment.grantType;
      login.grant_type = environment.grantType;
      login.oauth_token = this.socialUser.idToken

      console.log(login);
      this.signOn(login);
    } else {
      this.notification.notifyError("User details not found!")
    }
  }


  signUp(user:User){
    this.authService.signUp(user).subscribe(
      (response: ApiResponse) => {
        console.log(response)
        this.socialSignOn();
      },
      (err) => {
        console.log(err);
        this.notification.notifyError('Unable to create your Account!');
      }
    );
  }

  signUpWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((googleUser: SocialUser) => {
      this.socialUser = googleUser;
      // register user if not exist
      let user = new User();
      user.name = googleUser.firstName+" "+googleUser.lastName;
      user.email = googleUser.email;
      user.dp= googleUser.photoUrl
      user.authProvider = AuthProvider.GOOGLE;
      user.thirdPartyToken = googleUser.idToken;
      user.accountType = AccountType.INDIVIDUAL;
      user.role = UserRole.BUYER;
      user.mobile="Not Provided"
        this.signUp(user);
    });
  }


  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((googleUser: SocialUser) => {
      this.socialUser = googleUser;
       // register user if not exist
      let user = new User();
      user.name = googleUser.firstName+" "+googleUser.lastName;
      user.email = googleUser.email;
      user.dp= googleUser.photoUrl
      user.authProvider = AuthProvider.GOOGLE;
      user.thirdPartyToken = googleUser.idToken;
      user.accountType = AccountType.INDIVIDUAL;
      user.role = UserRole.BUYER;
      user.mobile="Not Provided"
      this.signUp(user);
    });
  }

  viewPassword(e){
    this.isVisible=!this.isVisible;
  }

  ngOnInit(): void {
    this.getUser();
    this.titleService.setTitle('Login to your herb.ng Account');
  }
}
