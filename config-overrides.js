const {
  override,
  fixBabelImports,
  addLessLoader,
} = require("customize-cra");

const { injectBabelPlugin } = require('react-app-rewired');

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd", libraryDirectory: "es", style: 'css'
  }),
  // addLessLoader({
  //   javascriptEnabled: true,
  //   modifyVars: { "@primary-color": "#1DA57A" }
  // })
);

// module.exports = function override(config, env) {
// 	config = injectBabelPlugin(
// 		['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }],
// 		config,
// 	);
// 	return config;
// };