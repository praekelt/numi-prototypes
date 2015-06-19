module.exports = {
  entry: "./src/app.js",
  output: {
    path: "./build",
    publicPath: "/build/",
    filename: "build.js"
  },
  module: {
    loaders: [
      { test: /\.scss/, loader: "style!css!sass" },
      { test: /\.html$/, loader: "ractive" }
    ]
  }
};
