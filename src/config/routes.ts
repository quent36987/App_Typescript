import IRoute from '../interfaces/route';
import AboutPage from '../pages/about';
import HomePage from '../pages/home';
import ChronoPage from '../pages/chrono';
import ChronoForm from '../pages/creation_chrono';

const routes: IRoute[] = [
    {
        path: '/',
        name: 'Home Page',
        component: HomePage,
        exact: true
    },
    {
        path: '/about',
        name: 'About Page',
        component: AboutPage,
        exact: true
    },
    {
        path: '/chrono',
        name: 'Chrono Page',
        component: ChronoPage,
        exact: true
    },
    {
        path: '/about/:number',
        name: 'About Page',
        component: AboutPage,
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
]

export default routes;