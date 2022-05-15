import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { AppCluster } from './app.shared.cluster';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LandingComponent } from './pages/main/landing/landing.component';
import { CartsComponent } from './pages/carts/carts.component';
import { ShopItemsComponent } from './pages/shop-items/shop-items.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { TopComponent } from './components/top/top.component';
import { TopCategoryComponent } from './components/home/top-category/top-category.component';
import { ContactComponent } from './pages/contact/contact.component';
import { BestSellerComponent } from './components/home/best-seller/best-seller.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { RecentViewedComponent } from './components/home/recent-viewed/recent-viewed.component';
import { AboutComponent } from './pages/about/about.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import {
  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTreeModule } from '@angular/material/tree';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatListModule } from '@angular/material/list';
import { ShortNamePipe } from './pipes/short-name.pipe';
import { MatNativeDateModule } from '@angular/material/core';
import { GroupByPipe } from './pipes/group-by.pipe';
import { FilterByPipe } from './pipes/filter-by.pipe';
import { ExcerptPipe } from './pipes/excerpt.pipe';
import { TitleCasePipe } from './pipes/title-case.pipe';
import { TagInputModule } from 'ngx-chips';
import { MatCardModule } from '@angular/material/card';
import { AsyncPipe } from '@angular/common';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { VerifyAccountComponent } from './pages/verify-account/verify-account.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { LatestItemsComponent } from './components/latest-items/latest-items.component';
import { RatingViewComponent } from './views/rating-view/rating-view.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ActivateCardComponent } from './pages/activate-card/activate-card.component';
import { SearchComponent } from './pages/search/search.component';
import { UpdateProfileComponent } from './pages/update-profile/update-profile.component';
import { TermsComponent } from './pages/terms/terms.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { OrderDetailsComponent } from './pages/order-details/order-details.component';
import { CardBalanceComponent } from './pages/card-balance/card-balance.component';
import { StorageService } from './services/storage.service';
import { Store } from './enum/store.enum';
import { LoaderComponent } from './views/loader/loader.component';
import { ProductViewDialogComponent } from './components/dialogs/product-view-dialog/product-view-dialog.component';
import { HeaderInnerComponent } from './components/header-inner/header-inner.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { FlutterwaveModule } from 'flutterwave-angular-v3';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MarketItemsComponent } from './pages/market-items/market-items.component';
import { ShopsComponent } from './pages/shops/shops.component';
import { TopDealsComponent } from './components/home/top-deals/top-deals.component';
import { BabyCareComponent } from './components/home/baby-care/baby-care.component';
import { FabricCenterComponent } from './components/home/fabric-center/fabric-center.component';
import { PhoneCenterComponent } from './components/home/phone-center/phone-center.component';
import { FaqsComponent } from './pages/faqs/faqs.component';
import { SocialLoginModule, SocialAuthServiceConfig, SocialAuthService } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { OrderStatusComponent } from './pages/order-status/order-status.component';

export function tokenGetter() {
  return new StorageService().get(Store.TOKEN);
}

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,
    LandingComponent,
    ProductDetailsComponent,
    CartsComponent,
    ShopItemsComponent,
    CheckoutComponent,
    TopComponent,
    TopCategoryComponent,
    ContactComponent,
    BestSellerComponent,
    SignupComponent,
    LoginComponent,
    RecentViewedComponent,
    AboutComponent,
    ForgotPasswordComponent,
    VerifyAccountComponent,
    ResetPasswordComponent,
    LatestItemsComponent,
    RatingViewComponent,
    ProfileComponent,
    ActivateCardComponent,
    SearchComponent,
    UpdateProfileComponent,
    TermsComponent,
    PrivacyComponent,
    OrderDetailsComponent,
    CardBalanceComponent,
    LoaderComponent,
    ProductViewDialogComponent,
    HeaderInnerComponent,
    CategoriesComponent,
    OrdersComponent,
    ExcerptPipe,
    GroupByPipe,
    TitleCasePipe,
    FilterByPipe,
    MarketItemsComponent,
    ShopsComponent,
    TopDealsComponent,
    BabyCareComponent,
    FabricCenterComponent,
    PhoneCenterComponent,
    FaqsComponent,
    OrderStatusComponent,
  ],
  imports: [
    TagInputModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    SocialLoginModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatCheckboxModule,
    MatListModule,
    MatDividerModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatStepperModule,
    MatChipsModule,
    MatTreeModule,
    MatExpansionModule,
    MatRadioModule,
    MatGridListModule,
    MatCardModule,
    FlutterwaveModule,
    InfiniteScrollModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [
          '/business/login',
          '/business/signup',
          '/business/verify-account',
        ],
      },
    }),
  ],
  providers: [
    Title,
    AsyncPipe,
    AppCluster,
    JwtHelperService,
    SocialAuthService,
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { hasBackdrop: true },
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId)
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(environment.facebookAppId)
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
