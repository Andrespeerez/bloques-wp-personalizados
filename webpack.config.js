const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );
const fs = require( 'fs' );

const blocks = ['apg-hero', 'apg-google-reviews'];

const copyBlockAssetsPlugin = () => ({
	apply(compiler) {
		compiler.hooks.afterEmit.tap('CopyBlockAssets', () => {
			blocks.forEach(blockName => {
				const srcDir = path.resolve(__dirname, `src/blocks/${blockName}`);
				const destDir = path.resolve(__dirname, `dist/${blockName}`);

				if (!fs.existsSync(destDir)) {
					fs.mkdirSync(destDir, { recursive: true });
				}

				const extraFiles = blockName === 'apg-google-reviews' ? ['mock-data.php'] : [];
				const filesToCopy = ['render.php', 'block.json', `${blockName}.php`, ...extraFiles];
				filesToCopy.forEach(file => {
					const src = path.resolve(srcDir, file);
					const dest = path.resolve(destDir, file);
					if (fs.existsSync(src)) {
						fs.copyFileSync(src, dest);
					}
				});

				const rootFiles = [
					`${blockName}.css`,
					`${blockName}-rtl.css`,
					`style-${blockName}.css`,
					`style-${blockName}-rtl.css`
				];
				rootFiles.forEach(file => {
					const src = path.resolve(__dirname, 'dist', file);
					const dest = path.resolve(destDir, file);
					if (fs.existsSync(src)) {
						fs.copyFileSync(src, dest);
						fs.unlinkSync(src);
					}
				});
			});
		});
	}
});

const entries = {};
blocks.forEach(block => {
	entries[block] = `./src/blocks/${block}/index.js`;
});

module.exports = {
	...defaultConfig,
	entry: entries,
	output: {
		...defaultConfig.output,
		path: path.resolve(__dirname, 'dist'),
		filename: '[name]/index.js',
	},
	plugins: [
		...defaultConfig.plugins,
		copyBlockAssetsPlugin(),
	],
};
