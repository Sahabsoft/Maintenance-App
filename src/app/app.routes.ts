import { Routes } from '@angular/router';
import { OrderList  } from './features/maintenance-orders/pages/order-list/order-list';
import { AddOrder } from './features/maintenance-orders/pages/add-order/add-order';
import { EditOrder } from './features/maintenance-orders/pages/edit-order/edit-order';
import { ChangeStatus } from './features/maintenance-orders/pages/change-status/change-status';
import { CustomerList } from './features/customers/pages/customer-list/customer-list';
import { CustomerForm } from './features/customers/pages/customer-form/customer-form';
import { CustomerDetails } from './features/customers/pages/customer-details/customer-details';
import { Login } from './features/auth/pages/login/login';
import { OrderDetails } from './features/maintenance-orders/pages/order-details/order-details';
import { CustomerVisitList } from './features/Customer-Visit/Pages/customer-visit-list/customer-visit-list';
import { CustomerVisitForm } from './features/Customer-Visit/Pages/customer-visit-form/customer-visit-form';
import { CustomerVisitDetails } from './features/Customer-Visit/Pages/customer-visit-details/customer-visit-details';
import { Register } from './features/auth/pages/Register/register';
import { Booking } from './features/Customer-Visit/Pages/booking/booking';
import { TrackRequest } from './features/Customer-Visit/Pages/track-request/track-request';
import { TrackOrder } from './features/Customer-Visit/Pages/track-order/track-order';
import { authGuard } from './core/guards/auth-guard';
import { ScheduledVisit } from './features/Customer-Visit/scheduled-visit/scheduled-visit';
import { ChangeStatusDetails } from './features/maintenance-orders/pages/change-status-details/change-status-details';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'booking',
    pathMatch: 'full'
  },
  
   {
    path: 'ad',
    canActivate: [authGuard],
    children: [
  
  
  {
    path: 'ad',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  {
  path: 'orders',
  component: OrderList
}, {
  path: 'orders/new',
  component: AddOrder
}, {
  path: 'orders/:id/details',
  component: OrderDetails
}, {
  path: 'orders/:id/edit',
  component: EditOrder
}, {
  path: 'orders/:id/status',
  component: ChangeStatus
}, {
  path: 'orders/:id/status-details',
  component: ChangeStatusDetails
}, 
{
  path: 'customers',
  component: CustomerList
}, {
  path: 'customers/new',
  component: CustomerForm
}, {
  path: 'customers/:id',
  component: CustomerDetails
}, {
  path: 'customers/:id/edit',
  component: CustomerForm
}, {
  path: 'customerVisits',
  component: CustomerVisitList
}, {
  path: 'customerVisits/new',
  component: CustomerVisitForm
}, {
  path: 'customerVisits/:id',
  component: CustomerVisitDetails
}, {
  path: 'customerVisits/:id/edit',
  component: CustomerVisitForm
},
{  path: 'scheduledVisit',
  component: ScheduledVisit}
 ] }, {
  path: 'ad/login', 
  component: Login
  }, {
    path: 'ad/register', 
    component: Register
},
 
{
  path:'booking',
  component:Booking,
   data: {
      hideNavbar: true
    }
},  {
    path: 'track-request/:id',
     component:TrackRequest,
   data: {
      hideNavbar: true
    }
  },  {
    path: 'track-order',
     component:TrackOrder,
   data: {
      hideNavbar: true
    }
  }
];
