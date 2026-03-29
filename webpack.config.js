const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );
const fs = require( 'fs' );

const copyPhpFile = () => ({
	apply(compiler) {
		compiler.hooks.afterEmit.tap('CopyPhpFile', () => {
			const src = path.resolve(__dirname, 'src/blocks/ds-hero/ds-hero.php');
			const dest = path.resolve(__dirname, 'dist/ds-hero/ds-hero.php');
			fs.copyFileSync(src, dest);
		});
	}
});

module.exports = {
	...defaultConfig,
	entry: {
		index: './src/blocks/ds-hero/index.js',
	},
	output: {
		...defaultConfig.output,
		path: __dirname + '/dist/ds-hero',
	},
	plugins: [
		...defaultConfig.plugins,
		copyPhpFile(),
	],
};
