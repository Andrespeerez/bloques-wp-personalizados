import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ColorPicker, SelectControl, TextControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import CustomCSSEditor from './custom-css-editor';

function InspectorTabs( { currentTab, onTabChange } ) {
    const tabs = [
        { name: 'general', title: __( 'General', 'apg-ricky-morty' ) },
        { name: 'style', title: __( 'Style', 'apg-ricky-morty' ) },
        { name: 'advanced', title: __( 'Advanced', 'apg-ricky-morty' ) },
    ];

    return (
        <div className="components-tab-panel__tabs">
            { tabs.map( ( tab ) => (
                <button
                    key={ tab.name }
                    className={ `components-tab-panel__tab ${ currentTab === tab.name ? 'is-active' : '' }` }
                    onClick={ () => onTabChange( tab.name ) }
                >
                    { tab.title }
                </button>
            ) ) }
        </div>
    );
}

function generateUniqueId( prefix = 'apg' ) {
    return prefix + '-' + Math.random().toString( 36 ).substring( 2, 9 );
}

function generateBlockCSS( uniqueId, attributes ) {
    const {
        cardBackgroundColor,
        padding,
        borderRadius,
    } = attributes;

    let css = `.apg-ricky-morty-${ uniqueId } {\n`;
    css += `    --card-bg: ${ cardBackgroundColor };\n`;
    css += `    --card-padding: ${ padding }px;\n`;
    css += `    --card-radius: ${ borderRadius }px;\n`;
    css += `}\n\n`;

    css += `.apg-ricky-morty-${ uniqueId } .apg-ricky-morty-card {\n`;
    css += `    background-color: var(--card-bg);\n`;
    css += `    padding: var(--card-padding);\n`;
    css += `    border-radius: var(--card-radius);\n`;
    css += `}\n\n`;

    return css;
}

function RickyMortyCard( { character } ) {
    const statusColor = character.status === 'Alive' ? '#4caf50' : character.status === 'Dead' ? '#f44336' : '#9e9e9e';
    
    return (
        <li className="apg-ricky-morty-card">
            <div className="apg-ricky-morty-header">
                <img src={ character.image } alt={ character.name } />
                <h3>{ character.name }</h3>
            </div>
            <div className="apg-ricky-morty-info">
                <span className="apg-ricky-morty-status" style={ { color: statusColor } }>
                    { character.status }
                </span>
                <span className="apg-ricky-morty-species">{ character.species }</span>
                <span className="apg-ricky-morty-gender">{ character.gender }</span>
            </div>
        </li>
    );
}

export default function Edit( { attributes, setAttributes } ) {
    const { uniqueID, cantidad, padding, borderRadius, cardBackgroundColor, customCSS } = attributes;
    const [ currentTab, setCurrentTab ] = useState( 'general' );
    const [ characters, setCharacters ] = useState( [] );
    const [ loading, setLoading ] = useState( false );

    useEffect( () => {
        if ( ! uniqueID ) {
            setAttributes( { uniqueID: generateUniqueId() } );
        }
    }, [] );

    useEffect( () => {
        if ( characters.length === 0 && cantidad > 0 ) {
            setLoading( true );
            fetch( 'https://rickandmortyapi.com/api/character/?limit=20' )
                .then( res => res.json() )
                .then( data => {
                    setCharacters( data.results || [] );
                    setLoading( false );
                } )
                .catch( () => {
                    setLoading( false );
                } );
        }
    }, [ cantidad ] );

    const displayCharacters = characters.slice( 0, cantidad );
    const blockCSS = uniqueID ? generateBlockCSS( uniqueID, attributes ) : '';
    const fullCSS = blockCSS + ( customCSS || '' );

    return (
        <div { ...useBlockProps() }>
            <InspectorControls>
                <InspectorTabs currentTab={ currentTab } onTabChange={ setCurrentTab } />
                <div className="components-tab-panel__tab-content">
                    { currentTab === 'general' && (
                        <PanelBody title={ __( 'Configuración', 'apg-ricky-morty' ) }>
                            <RangeControl
                                label={ __( 'Cantidad de personajes', 'apg-ricky-morty' ) }
                                value={ cantidad }
                                onChange={ ( value ) => setAttributes( { cantidad: value } ) }
                                min={ 1 }
                                max={ 20 }
                            />
                        </PanelBody>
                    ) }

                    { currentTab === 'style' && (
                        <PanelBody title={ __( 'Estilos de tarjeta', 'apg-ricky-morty' ) }>
                            <ColorPicker
                                label={ __( 'Color de fondo', 'apg-ricky-morty' ) }
                                value={ cardBackgroundColor }
                                onChange={ ( value ) => setAttributes( { cardBackgroundColor: value } ) }
                            />
                            <RangeControl
                                label={ __( 'Padding (px)', 'apg-ricky-morty' ) }
                                value={ padding }
                                onChange={ ( value ) => setAttributes( { padding: value } ) }
                                min={ 0 }
                                max={ 50 }
                            />
                            <RangeControl
                                label={ __( 'Border Radius (px)', 'apg-ricky-morty' ) }
                                value={ borderRadius }
                                onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
                                min={ 0 }
                                max={ 30 }
                            />
                        </PanelBody>
                    ) }

                    { currentTab === 'advanced' && (
                        <PanelBody title={ __( 'CSS Personalizado', 'apg-ricky-morty' ) }>
                            <CustomCSSEditor
                                value={ customCSS }
                                onChange={ ( value ) => setAttributes( { customCSS: value } ) }
                            />
                        </PanelBody>
                    ) }
                </div>
            </InspectorControls>

            { fullCSS && (
                <style>{ fullCSS }</style>
            ) }

            <div className={ `apg-ricky-morty-${ uniqueID }` }>
                <ul className="apg-ricky-morty-list">
                    { loading && (
                        <p>{ __( 'Cargando personajes...', 'apg-ricky-morty' ) }</p>
                    ) }
                    { ! loading && displayCharacters.map( ( character ) => (
                        <RickyMortyCard key={ character.id } character={ character } />
                    ) ) }
                </ul>
            </div>
        </div>
    );
}
