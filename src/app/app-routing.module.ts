import { ShopsComponent } from './pages/shops/shops.component';
import { MarketItemsComponent } from './pages/market-items/market-items.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { MainComponent } from './pages/main/main.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartsComponent } from './pages/carts/carts.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ShopItemsComponent } from './pages/shop-items/shop-items.component';
import { ContactComponent } from './pages/contact/contact.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';
import { AboutComponent } from './pages/about/about.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { VerifyAccountComponent } from './pages/verify-account/verify-account.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ActivateCardComponent } from './pages/activate-card/activate-card.component';
import { SearchComponent } from './pages/search/search.component';
import { UpdateProfileComponent } from './pages/update-profile/update-profile.component';
import { TermsComponent } from './pages/terms/terms.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { CardBalanceComponent } from './pages/card-balance/card-balance.component';
import { OrderDetailsComponent } from './pages/order-details/order-details.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { FaqsComponent } from './pages/faqs/faqs.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { OrderStatusComponent } from './pages/order-status/order-status.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'index',
    component: MainComponent,
  },
  {
    path: 'cart',
    component: CartsComponent,
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
  },
  {
    path: 'market/:categoryId',
    component: MarketItemsComponent,
  },
  {
    path: 'market',
    component: MarketItemsComponent,
  },
  {
    path: 'market/:categoryId/:subCategoryId',
    component: MarketItemsComponent,
  },
  {
    path: 'shop/:shopName',
    component: ShopItemsComponent,
  },
  {
    path: 'shop',
    component: MarketItemsComponent,
  },
  {
    path: 'shops',
    component: ShopsComponent,
  },
  {
    path: 'categories',
    component: CategoriesComponent,
  },
  {
    path: 'product-details/:id',
    component: ProductDetailsComponent,
  },
  {
    path: 'product/:id',
    component: ProductDetailsComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signin',
    component: LoginComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'verify-account',
    component: VerifyAccountComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'terms',
    component: TermsComponent,
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'faqs',
    component: FaqsComponent,
  },
  {
    path: 'lvc/card/activation',
    component: ActivateCardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'lvc/card/balance-inquiry',
    component: CardBalanceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'update-profile',
    component: UpdateProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'order/details/:id',
    component: OrderDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'order/status',
    component: OrderStatusComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      onSameUrlNavigation: "reload",
      relativeLinkResolution: 'legacy'
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
