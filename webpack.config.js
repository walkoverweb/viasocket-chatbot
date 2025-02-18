const path = require("path");

module.exports = {
  entry: "./src/App.js",
  output: {
    filename: "app-local.js",
    path: path.resolve(__dirname, "chatbot-build"),
  },
  externals: {
    react: "React",
    "react-dom/client": "ReactDOM",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
};
