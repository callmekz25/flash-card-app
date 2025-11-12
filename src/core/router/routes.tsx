import { flashcardRoutes } from '@/modules/flashcard/routes';
import { authRoutes } from '@/modules/auth/routes';
import { homeRoutes } from '@/modules/home/routes';
import { quizRoutes } from '@/modules/quiz/routes';
import { progressRoutes } from '@/modules/progress/routes';
import { collectionRoutes } from '@/modules/collection/routes';

export const appRoutes = [
  ...authRoutes,
  ...flashcardRoutes,
  ...homeRoutes,
  ...quizRoutes,
  ...flashcardRoutes,
  ...progressRoutes,
  ...collectionRoutes,
];
