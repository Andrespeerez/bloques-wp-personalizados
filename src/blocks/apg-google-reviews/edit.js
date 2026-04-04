/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';

/**
 * WordPress components.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/components/
 */
import { PanelBody, TextControl, RangeControl } from '@wordpress/components';

/**
 * React hook for side effects.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-element/#useeffect
 */
import { useEffect } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

function generateUniqueId() {
	return 'apg-google-reviews-' + Math.random().toString(36).substring(2, 9);
}

export default function Edit({ attributes, setAttributes, clientId}) {
	const { placeId, apiKey, cantidad, uniqueId } = attributes;

	useEffect(() => {
		if (!uniqueId) {
			setAttributes({ uniqueId: generateUniqueId() });
		}
	}, [clientId]);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Configuración de Google Places', 'apg-google-reviews')}>
					<TextControl
						label={__('Google API Key', 'apg-google-reviews')}
						value={apiKey || ''}
						onChange={(value) => setAttributes({ apiKey: value })}
						help={__('Obtén tu API Key en Google Cloud Console', 'apg-google-reviews')}
					/>
					<TextControl
						label={__('Place ID', 'apg-google-reviews')}
						value={placeId || ''}
						onChange={(value) => setAttributes({ placeId: value })}
						help={__('ID del negocio en Google Maps (ej: ChIJN1t_tDeuEmsRU...)', 'apg-google-reviews')}
					/>
					<RangeControl
						label={__('Cantidad de reseñas', 'apg-google-reviews')}
						value={cantidad || 4}
						onChange={(value) => setAttributes({ cantidad: value })}
						min={1}
						max={10}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...useBlockProps()}>
				{!placeId || !apiKey ? (
					<p style={{ padding: '20px', textAlign: 'center' }}>
						{__('Configura el Place ID y API Key para mostrar las reseñas', 'apg-google-reviews')}
					</p>
				) : (
					<p style={{ padding: '20px', textAlign: 'center' }}>
						{__('Reseñas de Google Places (se mostrarán en el frontend)', 'apg-google-reviews')}
					</p>
				)}
			</div>
		</>
	);
}
