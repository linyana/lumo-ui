import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [react(), tailwindcss()],
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
