import { Routes } from '@angular/router';

import { AppLayout } from '@core/layouts/app-layout/app-layout';
import { AuthLayout } from '@core/layouts/auth-layout/auth-layout';
import { BlankLayout } from '@core/layouts/blank-layout/blank-layout';
import { authGuard } from '@core/auth/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: BlankLayout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@features/welcome/welcome-page/welcome-page').then((m) => m.WelcomePage),
      },
    ],
  },
  {
    path: 'error',
    component: AppLayout,
    children: [
      {
        path: 'not-found',
        loadComponent: () => import('@core/errors/not-found/not-found').then((m) => m.NotFound),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      {
        path: 'register',
        loadComponent: () =>
          import('@features/auth/register/register-page/register-page').then((m) => m.RegisterPage),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('@features/auth/login/login-page/login-page').then((m) => m.LoginPage),
      },
    ],
  },
  {
    path: '',
    component: AppLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'articles',
        loadComponent: () =>
          import('@features/articles/articles-page/articles-page').then((m) => m.ArticlesPage),
      },
      {
        path: 'articles/create',
        loadComponent: () =>
          import('@features/articles/article-create-page/article-create-page').then(
            (m) => m.ArticleCreatePage,
          ),
      },
      {
        path: 'articles/:id',
        loadComponent: () =>
          import('@features/articles/article-view-page/article-view-page').then(
            (m) => m.ArticleViewPage,
          ),
      },
      {
        path: 'topics',
        loadComponent: () =>
          import('@features/topics/topics-page/topics-page').then((m) => m.TopicsPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('@features/profile/profile-page/profile-page').then((m) => m.ProfilePage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
