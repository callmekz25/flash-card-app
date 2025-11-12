import Layout from '@/shared/layouts/layout';
import Quiz from './pages/quiz';

export const quizRoutes = [
  {
    element: <Layout />,
    children: [
      {
        path: '/collections/:id/quiz',
        element: <Quiz />,
      },
    ],
  },
];
