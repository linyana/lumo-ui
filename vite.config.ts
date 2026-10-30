import { fileURLToPath, URL } from 'node:url';
import { defineConfig, type Plugin, type PreviewServer, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Deployment reads public/_headers; Vite needs the same charset declared by middleware.
function docsCharset(): Plugin {
	const configure = (server: ViteDevServer | PreviewServer) => {
		server.middlewares.use((req, res, next) => {
			const pathname = req.url?.split('?')[0];
			if (
				pathname === '/llms.txt' ||
				pathname === '/llms-full.txt' ||
				(pathname?.startsWith('/docs/') && pathname.endsWith('.md'))
			) {
				res.setHeader('Content-Type', 'text/plain; charset=utf-8');
			}
			next();
		});
	};

	return {
		name: 'lumo-docs-charset',
		configureServer: configure,
		configurePreviewServer: configure,
	};
}

export default defineConfig({
	plugins: [react(), tailwindcss(), docsCharset()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	server: {
		// Bind IPv4 explicitly. Vite's default `host: 'localhost'` resolves to
		// `::1` on Windows, so it never sees another dev server squatting on
		// 127.0.0.1:5173 and both silently claim the same port. Binding
		// 127.0.0.1 makes the collision real, so the port auto-increment
		// (5173 -> 5174 -> ...) actually kicks in.
		host: '127.0.0.1',
	},
});
