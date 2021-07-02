module.exports = {
  style: {
    postcss: {
      plugins: [require("autoprefixer")],
    },
  },
  babel: {
    plugins: ["@babel/plugin-proposal-nullish-coalescing-operator"],
  },
}
