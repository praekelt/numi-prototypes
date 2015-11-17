module.exports = {
  entry: "./src/app.js",
  output: {
    path: "./build",
    publicPath: "/build/",
    filename: "build.js"
  },
  module: {
    loaders: [
      {test: /\.css/, loader: "style!css"},
      {test: /\.scss/, loader: "style!css!sass"},
      {test: /\.html$/, loader: "ractive"}
    ]
  }
};
