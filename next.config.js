const withLess = require("next-with-less");
const lessToJS = require("less-vars-to-js");
const fileSystem = require("fs");
const path = require("path");

// const themeVariables = lessToJS(
//   fileSystem.readFileSync(
//     path.resolve(__dirname, "./public/style/variables.less"),
//     "utf8"
//   )
// );
const ignoreCoreModules = (config) => {
  config.resolve = {
    ...config.resolve,
    fallback: {
      fs: false,
      path: false,
      os: false,
    },
  };
  return config;
};
module.exports = withLess({
  webpack: ignoreCoreModules,
  lessLoaderOptions: {
    lessOptions: {
    //   modifyVars: themeVariables,
    },
  },
});
