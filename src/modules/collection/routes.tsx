import Layout from '@/shared/layouts/layout';
import Collections from './pages/collection';
import CollectionDetail from './pages/collectionDetail';

export const collectionRoutes = [
  {
    element: <Layout />,
    children: [
      {
        path: '/collections',
        element: <Collections />,
      },
      {
        path: '/collections/:id',
        element: <CollectionDetail />,
      },
    ],
  },
];
