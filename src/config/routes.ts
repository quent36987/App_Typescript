import IRoute from '../interfaces/route';
import ProfilePage from '../pages/ProfilePage';
import HomePage from '../pages/HomePage';
import ChronoPage from '../pages/ChronoPage';
import AuthPage from '../pages/AuthPage';
import ChronoListPage from '../pages/ChronoListPage';
import ChronoForm from '../pages/NewExoPage';
import DashBoardAdminPage from '../pages/AdminDashboard/DashBoardAdmin';
import TimerPage from '../pages/TimerPage';
import UpdateExoPage from '../pages/UpdateExoPage';
import DashBoardExoList from '../pages/AdminDashboard/DashBoardExoList';

const routes: IRoute[] = [
    {
        path: '/',
        name: 'Home Page',
        component: HomePage,
        exact: true
    },
    {
        path: '/profile',
        name: 'Profile Page',
        component: ProfilePage,
        exact: true
    },
    {
        path: '/chrono',
        name: 'Chrono List Page',
        component: ChronoListPage,
        exact: true
    },
    {
        path: '/chrono/:exoId',
        name: 'Chrono Page',
        component: ChronoPage,
        exact: true
    },
    {
        path: '/chronoform',
        name: 'Chrono Form',
        component: ChronoForm,
        exact: true
    },
    {
        path: '/auth/:type',
        name: 'Auth Page',
        component: AuthPage,
        exact: true
    },
    {
        path: '/dashboard',
        name: 'DashBoard Page',
        component: DashBoardAdminPage,
        exact: true
    },
    {
        path: '/dashboard2',
        name: 'DashBoard Page 2',
        component: DashBoardExoList,
        exact: true
    },
    {
        path: '/timer',
        name: 'Timer Page',
        component: TimerPage,
        exact: true
    },
    {
        path: '/updateform/:exoId',
        name: 'Update Form Page',
        component: UpdateExoPage,
        exact: true
    }
]

export default routes;