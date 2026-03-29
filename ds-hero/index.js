/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

import { __, _x } from '@wordpress/i18n';

import './style.scss';

import Edit from './edit';
import save from './save';
import metadata from './block.json';

registerBlockType( metadata.name, {
	...metadata,
	title: _x( 'Hero Section', 'block title', 'ds-hero' ),
	description: __( 'Bloque hero personalizable con imagen con mascara', 'ds-hero' ),
	keywords: [ __( 'hero', 'ds-hero' ), __( 'banner', 'ds-hero' ), __( 'header', 'ds-hero' ) ],
	edit: Edit,
	save,
} );
