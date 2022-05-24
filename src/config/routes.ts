import IRoute from '../interfaces/route';
import ProfilePage from '../pages/ProfilePage';
import HomePage from '../pages/HomePage';
import ChronoPage from '../pages/ExoPage';
import ChronoForm from '../pages/NewExoPage';
import AuthPage from '../pages/AuthPage';

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
        name: 'Chrono Page',
        component: ChronoPage,
        exact: true
    },
    {
        path: '/chrono/:number',
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
    }
]

export default routes;