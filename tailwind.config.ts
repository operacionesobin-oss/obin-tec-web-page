import type { Config } from 'tailwindcss';

// Tokens de marca OBIN — fuente de verdad: "🎨 Sistema de Diseño OBIN"
// Rol semántico → variable CSS. Los valores por tema viven en globals.css.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  // El tema lo fija una clase en <html>, no la media query: el usuario puede
  // anular la preferencia del sistema y su elección persiste.
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Capa semántica: es la que usan los componentes.
        surface: {
          DEFAULT: token('surface'),
          sunken: token('surface-sunken'),
          raised: token('surface-raised'),
          brand: token('surface-brand'),
        },
        line: {
          DEFAULT: token('line'),
          strong: token('line-strong'),
        },
        content: {
          DEFAULT: token('content'),
          secondary: token('content-secondary'),
          muted: token('content-muted'),
        },
        danger: token('danger'),
        accent: {
          DEFAULT: token('accent'),
          soft: token('accent-soft'),
          btn: token('accent-btn'),
          'btn-hover': token('accent-btn-hover'),
          ring: token('accent-ring'),
        },

        // Escalas de marca. Siguen siendo la fuente de verdad y se usan
        // directamente donde el color no depende del tema (bandas profundas).
        'obin-blue': {
          900: '#1B2A6B',
          800: '#253981', // color de marca principal
          700: '#2F4596',
          600: '#4156A8',
          500: '#5569AF',
          400: '#7A8BC4',
          300: '#A3B0D6',
          200: '#CDD4E8',
          100: '#E6EAF4',
          50: '#F3F5FB',
        },
        ink: {
          900: '#0F1220',
          800: '#1C2238',
          700: '#2B3250',
          600: '#434A68',
          500: '#5E6685',
          400: '#868DA8',
          300: '#B3B9CC',
          200: '#DADDE6',
          150: '#E6E8EF',
          100: '#EFF1F5',
          50: '#F7F8FB',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      // Escala tipográfica por rol, no por valor. Cada token nombra el trabajo
      // que hace el texto; los px son consecuencia, no decisión.
      fontSize: {
        // Metadatos: pies de foto, etiquetas, legal
        meta: ['13px', { lineHeight: '1.5', letterSpacing: '0' }],
        // Interfaz: nav, enlaces de footer, botones
        label: ['14px', { lineHeight: '1.45', letterSpacing: '-0.005em' }],
        // Cuerpo denso: tarjetas, pasos
        body: ['15px', { lineHeight: '1.65', letterSpacing: '-0.006em' }],
        // Cuerpo por defecto
        'body-lg': ['16px', { lineHeight: '1.65', letterSpacing: '-0.008em' }],
        // Entradilla: subtítulo de hero e intro de página
        lead: ['clamp(17px, 1.1vw + 14px, 20px)', { lineHeight: '1.5', letterSpacing: '-0.012em' }],
        // Título de tarjeta o paso (h3)
        subhead: ['clamp(19px, 0.6vw + 17px, 21px)', { lineHeight: '1.25', letterSpacing: '-0.022em' }],
        // Cita destacada
        quote: ['clamp(23px, 1.8vw + 16px, 30px)', { lineHeight: '1.28', letterSpacing: '-0.025em' }],
        // Cifra: sólo para magnitudes reales
        stat: ['clamp(26px, 1.6vw + 20px, 32px)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        // Antetítulo de sección
        kicker: ['12px', { lineHeight: '1.4', letterSpacing: '0.1em' }],
        // Medida y secuencia (mono): numeración de pasos
        data: ['13px', { lineHeight: '1.4', letterSpacing: '0.02em' }],
      },
      maxWidth: {
        container: '1200px',
      },
      backgroundImage: {
        'obin-gradient':
          'linear-gradient(135deg, rgb(var(--gradient-from)) 0%, rgb(var(--gradient-to)) 100%)',
        'obin-gradient-soft':
          'linear-gradient(135deg, rgb(var(--gradient-soft-from)) 0%, rgb(var(--gradient-soft-to)) 100%)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
      },
      borderRadius: {
        card: '14px',
      },
    },
  },
  plugins: [],
};

export default config;
