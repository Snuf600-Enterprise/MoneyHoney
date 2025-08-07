
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '1rem',
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
				honey: {
					primary: 'hsl(var(--honey-primary))',
					secondary: 'hsl(var(--honey-secondary))',
				},
				category: {
					food: 'hsl(var(--category-food))',
					transport: 'hsl(var(--category-transport))',
					entertainment: 'hsl(var(--category-entertainment))',
					shopping: 'hsl(var(--category-shopping))',
					health: 'hsl(var(--category-health))',
					bills: 'hsl(var(--category-bills))',
					savings: 'hsl(var(--category-savings))',
					other: 'hsl(var(--category-other))',
				},
				success: 'hsl(var(--success))',
				warning: 'hsl(var(--warning))',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				xl: '1.5rem',
				'2xl': '2rem',
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			animation: {
				'bounce-gentle': 'bounce-gentle 2s infinite',
				'slide-up': 'slide-up 0.3s ease-out',
				'fade-in': 'fade-in 0.4s ease-out',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
			keyframes: {
				'bounce-gentle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'slide-up': {
					from: {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				}
			},
			boxShadow: {
				'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
				'gentle': '0 2px 10px rgba(0, 0, 0, 0.06)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
