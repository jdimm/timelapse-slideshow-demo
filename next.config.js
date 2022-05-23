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
