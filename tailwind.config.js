module.exports = {
  content: [
    './src/**/*.{html,ts}',
    // thêm các file khác nếu cần
    './node_modules/flowbite/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin')],
}
