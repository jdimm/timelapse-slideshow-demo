const serial = '513f13f5e05ae4f4cae8195786fe7a9c'
module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: `/slideshow/${serial}`, // Matched parameters can be used in the destination
        permanent: true,
      },
    ]
  },
}
