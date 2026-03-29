const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	entry: {
		index: './index.js',
	},
	output: {
		...defaultConfig.output,
		path: __dirname + '/build',
	},
};
