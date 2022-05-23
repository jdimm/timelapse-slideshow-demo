const serial = '816a263e7954a5ceb4cc608f61a89640'
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
