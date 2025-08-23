import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}"
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				blue: {
					25: '#f8faff',
					50: '#eff6ff',
					100: '#dbeafe',
					200: '#bfdbfe',
					300: '#93c5fd',
					400: '#60a5fa',
					500: '#3b82f6',
					600: '#2563eb',
					700: '#1d4ed8',
					800: '#1e40af',
					900: '#1e3a8a',
					950: '#172554',
					'university': '#3d4a7a',
					'university-light': '#5a6894',
					'university-dark': '#2a3456'
				},
				green: {
					50: '#f0fdf4',
					100: '#dcfce7',
					500: '#22c55e', 
					600: '#16a34a'
				},
				red: {
					500: '#ef4444',
					600: '#dc2626'
				},
				silver: '#c0c0c0',
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'shimmer': {
					'0%': {
						backgroundPosition: '-200% 0'
					},
					'100%': {
						backgroundPosition: '200% 0'
					}
				},
				'breathe': {
					'0%, 100%': {
						transform: 'scale(1)',
						filter: 'brightness(1) contrast(1) saturate(1.2)'
					},
					'50%': {
						transform: 'scale(1.02)',
						filter: 'brightness(1.1) contrast(1.3) saturate(1.5)'
					}
				},
				'float-line': {
					'0%, 100%': {
						transform: 'translateX(-120px) translateY(0px) rotate(0deg) scaleY(1) skewX(0deg)',
						opacity: '0.3',
						borderRadius: '0px'
					},
					'25%': {
						transform: 'translateX(-40px) translateY(-30px) rotate(45deg) scaleY(1.5) skewX(15deg)',
						opacity: '0.5',
						borderRadius: '10px'
					},
					'50%': {
						transform: 'translateX(80px) translateY(-50px) rotate(90deg) scaleY(2) skewX(30deg)',
						opacity: '0.7',
						borderRadius: '20px'
					},
					'75%': {
						transform: 'translateX(140px) translateY(-20px) rotate(135deg) scaleY(1.2) skewX(-10deg)',
						opacity: '0.6',
						borderRadius: '15px'
					}
				},
				'drift-line': {
					'0%, 100%': {
						transform: 'translateX(60px) translateY(40px) rotate(30deg) scaleX(1) skewY(0deg)',
						opacity: '0.2',
						borderRadius: '0px'
					},
					'33%': {
						transform: 'translateX(-20px) translateY(10px) rotate(120deg) scaleX(1.8) skewY(20deg)',
						opacity: '0.4',
						borderRadius: '8px'
					},
					'66%': {
						transform: 'translateX(-100px) translateY(-30px) rotate(210deg) scaleX(2.2) skewY(-25deg)',
						opacity: '0.6',
						borderRadius: '12px'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'shimmer': 'shimmer 2s ease-in-out infinite',
				'shimmer-delayed': 'shimmer 2s ease-in-out 0.5s infinite',
				'breathe': 'breathe 4s ease-in-out infinite',
				'float-line': 'float-line 6s ease-in-out infinite',
				'drift-line': 'drift-line 8s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;