// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Utilisateur',
    path: '/admin/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Formation',
    path: '/admin/courses',
    icon: icon('ic_user'),
  },
  {
    title: 'articles',
    path: '/admin/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'paramètres',
    path: '/admin/settings',
    icon: icon('ic_settings'),
  },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
