import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  // Pagina exibida quando o usuario esta offline e a rota nao esta em cache
  fallbacks: {
    document: "/offline",
  },
  workboxOptions: {
    // Aumentar o limite de tamanho de arquivo para cache (5MB)
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    runtimeCaching: [
      // Cache de paginas HTML — NetworkFirst: tenta rede, cai no cache se offline
      {
        urlPattern: /^https:\/\/[^/]+\/((?!api\/).)*$/,
        handler: "NetworkFirst",
        options: {
          cacheName: "pages-cache",
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60, // 24 horas
          },
        },
      },
      // Cache de assets estaticos (JS, CSS, fontes) — CacheFirst
      {
        urlPattern: /\.(js|css|woff2?|ttf|eot)$/,
        handler: "CacheFirst",
        options: {
          cacheName: "static-assets",
          expiration: {
            maxEntries: 64,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dias
          },
        },
      },
      // Cache de imagens — CacheFirst
      {
        urlPattern: /\.(png|jpg|jpeg|svg|gif|webp|ico)$/,
        handler: "CacheFirst",
        options: {
          cacheName: "image-cache",
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 dias
          },
        },
      },
      // Cache de fontes do Google Fonts
      {
        urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 365 * 24 * 60 * 60, // 1 ano
          },
        },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence Turbopack warning caused by next-pwa injecting Webpack config
  turbopack: {},
};

export default withPWA(nextConfig);
