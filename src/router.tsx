import { createBrowserRouter, Navigate } from 'react-router';
import App from '@/App';
import { docRoutes } from '@/pages';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{ index: true, element: <Navigate to={`/${docRoutes[0]!.path}`} replace /> },
			...docRoutes.map(({ path, element }) => ({ path, element })),
			{ path: '*', element: <Navigate to={`/${docRoutes[0]!.path}`} replace /> },
		],
	},
]);
