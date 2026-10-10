import AuthLayout from '~/features/auth/layouts/AuthLayout.vue'
import LoginPage from '~/features/auth/pages/LoginPage.vue'
import RegisterPage from '~/features/auth/pages/RegisterPage.vue'
import CashFlowLayout from '~/features/cashflows/layouts/CashFlowLayout.vue'
import HomePage from '~/features/cashflows/pages/HomePage.vue'
import DetailPage from '~/features/cashflows/pages/DetailPage.vue'
import UsersPage from '~/features/users/pages/UsersPage.vue'
import ProfilePage from '~/features/users/pages/ProfilePage.vue'
import NotFoundPage from '~/features/common/pages/NotFoundPage.vue'
export const appRoutes = [
  { path: '/auth', component: AuthLayout, children: [
    { path: 'login', component: LoginPage }, { path: 'register', component: RegisterPage }
  ]},
  { path: '/', component: CashFlowLayout, children: [
    { path: '', component: HomePage }, { path: 'cash-flows/:cashFlowId', component: DetailPage },
    { path: 'users', component: UsersPage }, { path: 'profile', component: ProfilePage }
  ]},
  { path: '/:pathMatch(.*)*', component: NotFoundPage }
]
