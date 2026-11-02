import { createBrowserRouter, Navigate, redirectDocument } from 'react-router';
import App from '@/App';
import { docRoutes } from '@/pages';
import Home from '@/pages/Home';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{ index: true, element: <Home /> },
			...docRoutes.map(({ path, element }) => ({ path, element })),
			{ path: 'llms', loader: () => redirectDocument('/llms.txt') },
			{ path: 'skills', loader: () => redirectDocument('/skills.md') },
			{ path: '*', element: <Navigate to={`/${docRoutes[0]!.path}`} replace /> },
		],
	},
]);
