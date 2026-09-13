import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
	plugins: [react()],
	server: {
		allowedHosts: ['portfolio-9lo2.onrender.com'],
	},
})
