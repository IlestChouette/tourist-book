/** @type {import('next').NextConfig} */
// Cabeceras de sécurité de base. Pas de Content-Security-Policy ici : elle
// casserait Google Analytics, les cartes et les vidéos intégrées sans test poussé.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Personne ne doit pouvoir afficher nos pages dans un cadre (clickjacking).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.tourist-book.com" }],
        destination: "https://tourist-book.com/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "advvfaipmddkfvmcwodl.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
