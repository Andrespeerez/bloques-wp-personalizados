/**
 * Retrieves the translation of text.
 */
import { __ } from '@wordpress/i18n';

import {
    useBlockProps,
    InnerBlocks,
    InspectorControls,
    MediaPlaceholder,
    MediaReplaceFlow,
} from '@wordpress/block-editor';

import {
    PanelBody,
    SelectControl,
    RangeControl,
    ToggleControl,
    Button,
    BaseControl,
    ColorPicker,
} from '@wordpress/components';

import CustomCSSEditor from './custom-css-editor';

import { useState, useEffect } from '@wordpress/element';

import './editor.scss';

const MASK_POSITION_OPTIONS = [
    { value: 'top left', label: 'Top Left' },
    { value: 'top center', label: 'Top Center' },
    { value: 'top right', label: 'Top Right' },
    { value: 'center left', label: 'Center Left' },
    { value: 'center center', label: 'Center' },
    { value: 'center right', label: 'Center Right' },
    { value: 'bottom left', label: 'Bottom Left' },
    { value: 'bottom center', label: 'Bottom Center' },
    { value: 'bottom right', label: 'Bottom Right' },
    { value: 'custom', label: 'Custom' },
];

const UNIT_OPTIONS = [
    { value: '%', label: '%' },
    { value: 'px', label: 'px' },
];

function InspectorTabs( { currentTab, onTabChange } ) {
    const tabs = [
        { name: 'general', title: __( 'General', 'apg-hero' ) },
        { name: 'style', title: __( 'Style', 'apg-hero' ) },
        { name: 'advanced', title: __( 'Advanced', 'apg-hero' ) },
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
        backgroundType,
        backgroundColor,
        backgroundGradient,
        backgroundImage,
        backgroundImagePosition,
        backgroundImageSize,
        overlayColor,
        overlayOpacity,
        maskEnabled,
        maskImageUrl,
        maskPositionPreset,
        maskCustomPosition,
        maskWidth,
        maskHeight,
        contentMaxWidth,
        contentPosition,
        verticalAlign,
        paddingDesktop,
        paddingTablet,
        paddingMobile,
    } = attributes;

    let css = `.apg-hero-${ uniqueId } {\n`;
    css += `    background-color: ${ backgroundColor || '#0d1b3e' };\n`;
    
    if ( backgroundType === 'gradient' && backgroundGradient ) {
        css += `    background-image: ${ backgroundGradient };\n`;
    } else if ( backgroundType === 'image' && backgroundImage?.url ) {
        css += `    background-image: url(${ backgroundImage.url });\n`;
        css += `    background-position: ${ backgroundImagePosition };\n`;
        css += `    background-size: ${ backgroundImageSize };\n`;
    }
    
    css += `    padding: ${ paddingDesktop[ 0 ] }px ${ paddingDesktop[ 1 ] }px ${ paddingDesktop[ 2 ] }px ${ paddingDesktop[ 3 ] }px;\n`;
    css += `}\n\n`;

    css += `.apg-hero-${ uniqueId }::before {\n`;
    css += `    content: '';\n`;
    css += `    position: absolute;\n`;
    css += `    top: 0;\n`;
    css += `    left: 0;\n`;
    css += `    right: 0;\n`;
    css += `    bottom: 0;\n`;
    css += `    background-color: ${ overlayColor || 'transparent' };\n`;
    css += `    opacity: ${ overlayOpacity };\n`;
    css += `    z-index: 1;\n`;
    css += `    pointer-events: none;\n`;
    css += `}\n\n`;

    const cmw = contentMaxWidth || { value: 1200, unit: 'px' };
    
    css += `.apg-hero-${ uniqueId } .apg-hero__inner {\n`;
    css += `    max-width: ${ cmw.value }${ cmw.unit };\n`;
    css += `    justify-content: ${ contentPosition === 'center' ? 'center' : ( contentPosition === 'right' ? 'flex-end' : 'flex-start' ) };\n`;
    css += `    align-items: ${ verticalAlign === 'top' ? 'flex-start' : ( verticalAlign === 'bottom' ? 'flex-end' : 'center' ) };\n`;
    css += `}\n\n`;

    if ( maskEnabled && maskImageUrl ) {
        const maskW = maskWidth?.desktop || { value: 480, unit: 'px' };
        const maskH = maskHeight?.desktop || { value: 420, unit: 'px' };
        
        css += `.apg-hero-${ uniqueId } .apg-hero__masked-image {\n`;
        css += `    mask-image: url(${ maskImageUrl });\n`;
        css += `    -webkit-mask-image: url(${ maskImageUrl });\n`;
        css += `    width: ${ maskW.value }${ maskW.unit };\n`;
        css += `    height: ${ maskH.value }${ maskH.unit };\n`;
        
        if ( maskPositionPreset === 'custom' && maskCustomPosition ) {
            if ( maskCustomPosition.left?.value !== '' ) {
                css += `    left: ${ maskCustomPosition.left.value }${ maskCustomPosition.left.unit };\n`;
                css += `    right: auto;\n`;
            }
            if ( maskCustomPosition.right?.value !== '' ) {
                css += `    right: ${ maskCustomPosition.right.value }${ maskCustomPosition.right.unit };\n`;
                css += `    left: auto;\n`;
            }
            if ( maskCustomPosition.top?.value !== '' ) {
                css += `    top: ${ maskCustomPosition.top.value }${ maskCustomPosition.top.unit };\n`;
                css += `    bottom: auto;\n`;
            }
            if ( maskCustomPosition.bottom?.value !== '' ) {
                css += `    bottom: ${ maskCustomPosition.bottom.value }${ maskCustomPosition.bottom.unit };\n`;
                css += `    top: auto;\n`;
            }
        }
        css += `}\n\n`;

        const maskWTablet = maskWidth?.tablet || { value: 80, unit: '%' };
        const maskHTablet = maskHeight?.tablet || { value: 50, unit: '%' };
        css += `@media (max-width: 1024px) {\n`;
        css += `    .apg-hero-${ uniqueId } .apg-hero__masked-image {\n`;
        css += `        width: ${ maskWTablet.value }${ maskWTablet.unit };\n`;
        css += `        height: ${ maskHTablet.value }${ maskHTablet.unit };\n`;
        css += `    }\n`;
        css += `}\n\n`;

        const maskWMobile = maskWidth?.mobile || { value: 100, unit: '%' };
        const maskHMobile = maskHeight?.mobile || { value: 60, unit: '%' };
        css += `@media (max-width: 767px) {\n`;
        css += `    .apg-hero-${ uniqueId } .apg-hero__masked-image {\n`;
        css += `        width: ${ maskWMobile.value }${ maskWMobile.unit };\n`;
        css += `        height: ${ maskHMobile.value }${ maskHMobile.unit };\n`;
        css += `    }\n`;
        css += `}\n`;
    }

    css += `@media (max-width: 1024px) {\n`;
    css += `    .apg-hero-${ uniqueId } {\n`;
    css += `        padding: ${ paddingTablet[ 0 ] }px ${ paddingTablet[ 1 ] }px ${ paddingTablet[ 2 ] }px ${ paddingTablet[ 3 ] }px;\n`;
    css += `    }\n`;
    css += `}\n\n`;

    css += `@media (max-width: 767px) {\n`;
    css += `    .apg-hero-${ uniqueId } {\n`;
    css += `        padding: ${ paddingMobile[ 0 ] }px ${ paddingMobile[ 1 ] }px ${ paddingMobile[ 2 ] }px ${ paddingMobile[ 3 ] }px;\n`;
    css += `    }\n`;
    css += `}\n`;

    return css;
}

export default function Edit( { attributes, setAttributes, clientId } ) {
    const {
        backgroundType,
        backgroundColor,
        backgroundGradient,
        backgroundImage,
        backgroundImagePosition,
        backgroundImageSize,
        overlayColor,
        overlayOpacity,
        maskEnabled,
        maskedImageUrl,
        maskedImageId,
        maskImageUrl,
        maskImageId,
        maskPositionPreset,
        maskCustomPosition,
        maskWidth,
        maskHeight,
        contentMaxWidth,
        contentPosition,
        verticalAlign,
        paddingDesktop,
        paddingTablet,
        paddingMobile,
        customCSS,
        uniqueID,
    } = attributes;

    const [ deviceType, setDeviceType ] = useState( 'desktop' );
    const [ activeTab, setActiveTab ] = useState( 'general' );
    const [ maskDeviceType, setMaskDeviceType ] = useState( 'desktop' );

    useEffect( () => {
        if ( ! uniqueID ) {
            setAttributes( { uniqueID: generateUniqueId() } );
        }
    }, [ clientId ] );

    const getPadding = () => {
        if ( deviceType === 'mobile' ) return paddingMobile;
        if ( deviceType === 'tablet' ) return paddingTablet;
        return paddingDesktop;
    };

    const updatePadding = ( index, value ) => {
        const padding = getPadding();
        const newPadding = [ ...padding ];
        newPadding[ index ] = value;
        if ( deviceType === 'mobile' ) {
            setAttributes( { paddingMobile: newPadding } );
        } else if ( deviceType === 'tablet' ) {
            setAttributes( { paddingTablet: newPadding } );
        } else {
            setAttributes( { paddingDesktop: newPadding } );
        }
    };

    const getMaskSize = () => {
        if ( maskDeviceType === 'mobile' ) return maskHeight?.mobile || { value: 60, unit: '%' };
        if ( maskDeviceType === 'tablet' ) return maskHeight?.tablet || { value: 50, unit: '%' };
        return maskHeight?.desktop || { value: 420, unit: 'px' };
    };

    const getMaskWidthValue = () => {
        if ( maskDeviceType === 'mobile' ) return maskWidth?.mobile?.value ?? 100;
        if ( maskDeviceType === 'tablet' ) return maskWidth?.tablet?.value ?? 80;
        return maskWidth?.desktop?.value ?? 480;
    };

    const getMaskWidthUnit = () => {
        if ( maskDeviceType === 'mobile' ) return maskWidth?.mobile?.unit ?? '%';
        if ( maskDeviceType === 'tablet' ) return maskWidth?.tablet?.unit ?? '%';
        return maskWidth?.desktop?.unit ?? 'px';
    };

    const getMaskHeightValue = () => {
        if ( maskDeviceType === 'mobile' ) return maskHeight?.mobile?.value ?? 60;
        if ( maskDeviceType === 'tablet' ) return maskHeight?.tablet?.value ?? 50;
        return maskHeight?.desktop?.value ?? 420;
    };

    const getMaskHeightUnit = () => {
        if ( maskDeviceType === 'mobile' ) return maskHeight?.mobile?.unit ?? '%';
        if ( maskDeviceType === 'tablet' ) return maskHeight?.tablet?.unit ?? '%';
        return maskHeight?.desktop?.unit ?? 'px';
    };

    const updateMaskWidth = ( value ) => {
        const newWidth = { ...maskWidth };
        if ( maskDeviceType === 'mobile' ) {
            newWidth.mobile = { ...newWidth.mobile, value: parseFloat( value ) || 0 };
        } else if ( maskDeviceType === 'tablet' ) {
            newWidth.tablet = { ...newWidth.tablet, value: parseFloat( value ) || 0 };
        } else {
            newWidth.desktop = { ...newWidth.desktop, value: parseFloat( value ) || 0 };
        }
        setAttributes( { maskWidth: newWidth } );
    };

    const updateMaskWidthUnit = ( unit ) => {
        const newWidth = { ...maskWidth };
        if ( maskDeviceType === 'mobile' ) {
            newWidth.mobile = { ...newWidth.mobile, unit };
        } else if ( maskDeviceType === 'tablet' ) {
            newWidth.tablet = { ...newWidth.tablet, unit };
        } else {
            newWidth.desktop = { ...newWidth.desktop, unit };
        }
        setAttributes( { maskWidth: newWidth } );
    };

    const updateMaskHeight = ( value ) => {
        const newHeight = { ...maskHeight };
        if ( maskDeviceType === 'mobile' ) {
            newHeight.mobile = { ...newHeight.mobile, value: parseFloat( value ) || 0 };
        } else if ( maskDeviceType === 'tablet' ) {
            newHeight.tablet = { ...newHeight.tablet, value: parseFloat( value ) || 0 };
        } else {
            newHeight.desktop = { ...newHeight.desktop, value: parseFloat( value ) || 0 };
        }
        setAttributes( { maskHeight: newHeight } );
    };

    const updateMaskHeightUnit = ( unit ) => {
        const newHeight = { ...maskHeight };
        if ( maskDeviceType === 'mobile' ) {
            newHeight.mobile = { ...newHeight.mobile, unit };
        } else if ( maskDeviceType === 'tablet' ) {
            newHeight.tablet = { ...newHeight.tablet, unit };
        } else {
            newHeight.desktop = { ...newHeight.desktop, unit };
        }
        setAttributes( { maskHeight: newHeight } );
    };

    const updateMaskPosition = ( side, value ) => {
        const newPosition = { ...maskCustomPosition };
        newPosition[ side ] = { ...newPosition[ side ], value: value };
        setAttributes( { maskCustomPosition: newPosition } );
    };

    const updateMaskPositionUnit = ( side, unit ) => {
        const newPosition = { ...maskCustomPosition };
        newPosition[ side ] = { ...newPosition[ side ], unit };
        setAttributes( { maskCustomPosition: newPosition } );
    };

    const getCustomPositionStyle = () => {
        const css = {};
        if ( maskPositionPreset !== 'custom' || !maskCustomPosition ) return css;
        
        if ( maskCustomPosition.left?.value !== '' ) {
            css.left = maskCustomPosition.left.value + maskCustomPosition.left.unit;
            css.right = 'auto';
        }
        if ( maskCustomPosition.right?.value !== '' ) {
            css.right = maskCustomPosition.right.value + maskCustomPosition.right.unit;
            css.left = 'auto';
        }
        if ( maskCustomPosition.top?.value !== '' ) {
            css.top = maskCustomPosition.top.value + maskCustomPosition.top.unit;
            css.bottom = 'auto';
        }
        if ( maskCustomPosition.bottom?.value !== '' ) {
            css.bottom = maskCustomPosition.bottom.value + maskCustomPosition.bottom.unit;
            css.top = 'auto';
        }
        return css;
    };

    const blockProps = useBlockProps( {
        className: `apg-hero${ uniqueID ? ' apg-hero-' + uniqueID : '' }`,
    } );

    const blockCSS = uniqueID ? generateBlockCSS( uniqueID, attributes ) : '';
    const fullCSS = blockCSS + ( customCSS || '' );

    return (
        <>
            <InspectorControls>
                <InspectorTabs currentTab={ activeTab } onTabChange={ setActiveTab } />

                { activeTab === 'general' && (
                    <PanelBody title={ __( 'Masked Image', 'apg-hero' ) } initialOpen={ true }>
                        <ToggleControl
                            label={ __( 'Enable Masked Image', 'apg-hero' ) }
                            checked={ maskEnabled }
                            onChange={ ( value ) => setAttributes( { maskEnabled: value } ) }
                        />

                        { maskEnabled && (
                            <>
                                <BaseControl label={ __( 'Image to Mask', 'apg-hero' ) }>
                                    <p style={ { fontSize: '12px', color: '#666', marginBottom: '8px' } }>
                                        { __( 'Upload the image you want to display.', 'apg-hero' ) }
                                    </p>
                                    { maskedImageUrl ? (
                                        <MediaReplaceFlow
                                            mediaId={ maskedImageId }
                                            mediaURL={ maskedImageUrl }
                                            onSelectMedia={ ( media ) => {
                                                setAttributes( {
                                                    maskedImageUrl: media.url,
                                                    maskedImageId: media.id,
                                                } );
                                            } }
                                            onRemoveMedia={ () => {
                                                setAttributes( {
                                                    maskedImageUrl: '',
                                                    maskedImageId: 0,
                                                } );
                                            } }
                                        />
                                    ) : (
                                        <MediaPlaceholder
                                            icon="format-image"
                                            onSelect={ ( media ) => {
                                                setAttributes( {
                                                    maskedImageUrl: media.url,
                                                    maskedImageId: media.id,
                                                } );
                                            } }
                                            accept="image/*"
                                            allowedTypes={ [ 'image' ] }
                                        />
                                    ) }
                                </BaseControl>

                                <BaseControl label={ __( 'Mask (PNG with transparency)', 'apg-hero' ) }>
                                    <p style={ { fontSize: '12px', color: '#666', marginBottom: '8px' } }>
                                        { __( 'Upload a PNG image with transparency to use as a mask.', 'apg-hero' ) }
                                    </p>
                                    { maskImageUrl ? (
                                        <MediaReplaceFlow
                                            mediaId={ maskImageId }
                                            mediaURL={ maskImageUrl }
                                            onSelectMedia={ ( media ) => {
                                                setAttributes( {
                                                    maskImageUrl: media.url,
                                                    maskImageId: media.id,
                                                } );
                                            } }
                                            onRemoveMedia={ () => {
                                                setAttributes( {
                                                    maskImageUrl: '',
                                                    maskImageId: 0,
                                                } );
                                            } }
                                        />
                                    ) : (
                                        <MediaPlaceholder
                                            icon="format-image"
                                            onSelect={ ( media ) => {
                                                setAttributes( {
                                                    maskImageUrl: media.url,
                                                    maskImageId: media.id,
                                                } );
                                            } }
                                            accept="image/*"
                                            allowedTypes={ [ 'image' ] }
                                        />
                                    ) }
                                </BaseControl>

                                <SelectControl
                                    label={ __( 'Position', 'apg-hero' ) }
                                    value={ maskPositionPreset }
                                    options={ MASK_POSITION_OPTIONS }
                                    onChange={ ( value ) => setAttributes( { maskPositionPreset: value } ) }
                                />

                                { maskPositionPreset === 'custom' && (
                                    <div style={ { marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' } }>
                                        <p style={ { fontWeight: 'bold', margin: '0 0 8px 0' } }>{ __( 'Custom Position', 'apg-hero' ) }</p>
                                        <div style={ { display: 'grid', gridTemplateColumns: '1fr auto 80px', gap: '8px', alignItems: 'center' } }>
                                            <span style={ { fontSize: '12px' } }>{ __( 'Left', 'apg-hero' ) }</span>
                                            <input
                                                type="number"
                                                value={ maskCustomPosition?.left?.value ?? '' }
                                                onChange={ ( e ) => updateMaskPosition( 'left', e.target.value ) }
                                                placeholder="0"
                                                style={ { width: '80px', padding: '4px 8px' } }
                                            />
                                            <SelectControl
                                                value={ maskCustomPosition?.left?.unit ?? '%' }
                                                options={ UNIT_OPTIONS }
                                                onChange={ ( value ) => updateMaskPositionUnit( 'left', value ) }
                                                style={ { width: '60px', margin: 0 } }
                                            />
                                        </div>
                                        <div style={ { display: 'grid', gridTemplateColumns: '1fr auto 80px', gap: '8px', alignItems: 'center' } }>
                                            <span style={ { fontSize: '12px' } }>{ __( 'Right', 'apg-hero' ) }</span>
                                            <input
                                                type="number"
                                                value={ maskCustomPosition?.right?.value ?? '' }
                                                onChange={ ( e ) => updateMaskPosition( 'right', e.target.value ) }
                                                placeholder="0"
                                                style={ { width: '80px', padding: '4px 8px' } }
                                            />
                                            <SelectControl
                                                value={ maskCustomPosition?.right?.unit ?? '%' }
                                                options={ UNIT_OPTIONS }
                                                onChange={ ( value ) => updateMaskPositionUnit( 'right', value ) }
                                                style={ { width: '60px', margin: 0 } }
                                            />
                                        </div>
                                        <div style={ { display: 'grid', gridTemplateColumns: '1fr auto 80px', gap: '8px', alignItems: 'center' } }>
                                            <span style={ { fontSize: '12px' } }>{ __( 'Top', 'apg-hero' ) }</span>
                                            <input
                                                type="number"
                                                value={ maskCustomPosition?.top?.value ?? '' }
                                                onChange={ ( e ) => updateMaskPosition( 'top', e.target.value ) }
                                                placeholder="0"
                                                style={ { width: '80px', padding: '4px 8px' } }
                                            />
                                            <SelectControl
                                                value={ maskCustomPosition?.top?.unit ?? '%' }
                                                options={ UNIT_OPTIONS }
                                                onChange={ ( value ) => updateMaskPositionUnit( 'top', value ) }
                                                style={ { width: '60px', margin: 0 } }
                                            />
                                        </div>
                                        <div style={ { display: 'grid', gridTemplateColumns: '1fr auto 80px', gap: '8px', alignItems: 'center' } }>
                                            <span style={ { fontSize: '12px' } }>{ __( 'Bottom', 'apg-hero' ) }</span>
                                            <input
                                                type="number"
                                                value={ maskCustomPosition?.bottom?.value ?? '' }
                                                onChange={ ( e ) => updateMaskPosition( 'bottom', e.target.value ) }
                                                placeholder="0"
                                                style={ { width: '80px', padding: '4px 8px' } }
                                            />
                                            <SelectControl
                                                value={ maskCustomPosition?.bottom?.unit ?? '%' }
                                                options={ UNIT_OPTIONS }
                                                onChange={ ( value ) => updateMaskPositionUnit( 'bottom', value ) }
                                                style={ { width: '60px', margin: 0 } }
                                            />
                                        </div>
                                    </div>
                                ) }

                                <div style={ { marginTop: '16px' } }>
                                    <p style={ { fontWeight: 'bold', margin: '0 0 8px 0' } }>{ __( 'Size', 'apg-hero' ) }</p>
                                    <BaseControl label={ __( 'Device', 'apg-hero' ) } style={ { marginBottom: '8px' } }>
                                        <Button
                                            isPressed={ maskDeviceType === 'desktop' }
                                            onClick={ () => setMaskDeviceType( 'desktop' ) }
                                            variant="secondary"
                                            style={ { marginRight: '4px' } }
                                        >
                                            D
                                        </Button>
                                        <Button
                                            isPressed={ maskDeviceType === 'tablet' }
                                            onClick={ () => setMaskDeviceType( 'tablet' ) }
                                            variant="secondary"
                                            style={ { marginRight: '4px' } }
                                        >
                                            T
                                        </Button>
                                        <Button
                                            isPressed={ maskDeviceType === 'mobile' }
                                            onClick={ () => setMaskDeviceType( 'mobile' ) }
                                            variant="secondary"
                                        >
                                            M
                                        </Button>
                                    </BaseControl>

                                    <div style={ { display: 'grid', gridTemplateColumns: '1fr auto 80px', gap: '8px', alignItems: 'center' } }>
                                        <span style={ { fontSize: '12px' } }>{ __( 'Width', 'apg-hero' ) }</span>
                                        <input
                                            type="number"
                                            value={ getMaskWidthValue() }
                                            onChange={ ( e ) => updateMaskWidth( e.target.value ) }
                                            min={ 0 }
                                            style={ { width: '80px', padding: '4px 8px' } }
                                        />
                                        <SelectControl
                                            value={ getMaskWidthUnit() }
                                            options={ UNIT_OPTIONS }
                                            onChange={ updateMaskWidthUnit }
                                            style={ { width: '60px', margin: 0 } }
                                        />
                                    </div>
                                    <div style={ { display: 'grid', gridTemplateColumns: '1fr auto 80px', gap: '8px', alignItems: 'center', marginTop: '8px' } }>
                                        <span style={ { fontSize: '12px' } }>{ __( 'Height', 'apg-hero' ) }</span>
                                        <input
                                            type="number"
                                            value={ getMaskHeightValue() }
                                            onChange={ ( e ) => updateMaskHeight( e.target.value ) }
                                            min={ 0 }
                                            style={ { width: '80px', padding: '4px 8px' } }
                                        />
                                        <SelectControl
                                            value={ getMaskHeightUnit() }
                                            options={ UNIT_OPTIONS }
                                            onChange={ updateMaskHeightUnit }
                                            style={ { width: '60px', margin: 0 } }
                                        />
                                    </div>
                                </div>
                            </>
                        ) }
                    </PanelBody>
                ) }

                { activeTab === 'style' && (
                    <>
                        <PanelBody title={ __( 'Background', 'apg-hero' ) } initialOpen={ true }>
                            <SelectControl
                                label={ __( 'Background Type', 'apg-hero' ) }
                                value={ backgroundType }
                                options={ [
                                    { value: 'color', label: __( 'Color', 'apg-hero' ) },
                                    { value: 'gradient', label: __( 'Gradient', 'apg-hero' ) },
                                    { value: 'image', label: __( 'Image', 'apg-hero' ) },
                                ] }
                                onChange={ ( value ) => setAttributes( { backgroundType: value } ) }
                            />

                            { backgroundType === 'color' && (
                                <BaseControl label={ __( 'Background Color', 'apg-hero' ) }>
                                    <ColorPicker
                                        color={ backgroundColor }
                                        onChange={ ( value ) => setAttributes( { backgroundColor: value } ) }
                                        enableAlpha
                                    />
                                </BaseControl>
                            ) }

                            { backgroundType === 'gradient' && (
                                <BaseControl label={ __( 'Gradient', 'apg-hero' ) }>
                                    <input
                                        type="text"
                                        value={ backgroundGradient }
                                        onChange={ ( e ) => setAttributes( { backgroundGradient: e.target.value } ) }
                                        placeholder="linear-gradient(...) or radial-gradient(...)"
                                        style={ { width: '100%', padding: '8px' } }
                                    />
                                </BaseControl>
                            ) }

                            { backgroundType === 'image' && (
                                <>
                                    <BaseControl label={ __( 'Background Image', 'apg-hero' ) }>
                                        { backgroundImage?.url ? (
                                            <MediaReplaceFlow
                                                mediaId={ backgroundImage.id }
                                                mediaURL={ backgroundImage.url }
                                                onSelectMedia={ ( media ) => {
                                                    setAttributes( {
                                                        backgroundImage: {
                                                            url: media.url,
                                                            id: media.id,
                                                            size: backgroundImage.size || 'cover',
                                                        },
                                                    } );
                                                } }
                                                onRemoveMedia={ () => {
                                                    setAttributes( {
                                                        backgroundImage: {
                                                            url: '',
                                                            id: 0,
                                                            size: 'cover',
                                                        },
                                                    } );
                                                } }
                                            />
                                        ) : (
                                            <MediaPlaceholder
                                                icon="format-image"
                                                onSelect={ ( media ) => {
                                                    setAttributes( {
                                                        backgroundImage: {
                                                            url: media.url,
                                                            id: media.id,
                                                            size: 'cover',
                                                        },
                                                    } );
                                                } }
                                                accept="image/*"
                                                allowedTypes={ [ 'image' ] }
                                            />
                                        ) }
                                    </BaseControl>

                                    <SelectControl
                                        label={ __( 'Position', 'apg-hero' ) }
                                        value={ backgroundImagePosition }
                                        options={ [
                                            { value: 'top left', label: 'Top Left' },
                                            { value: 'top center', label: 'Top Center' },
                                            { value: 'top right', label: 'Top Right' },
                                            { value: 'center center', label: 'Center' },
                                            { value: 'bottom left', label: 'Bottom Left' },
                                            { value: 'bottom center', label: 'Bottom Center' },
                                            { value: 'bottom right', label: 'Bottom Right' },
                                        ] }
                                        onChange={ ( value ) => setAttributes( { backgroundImagePosition: value } ) }
                                    />

                                    <SelectControl
                                        label={ __( 'Size', 'apg-hero' ) }
                                        value={ backgroundImageSize }
                                        options={ [
                                            { value: 'auto', label: 'Auto' },
                                            { value: 'cover', label: 'Cover' },
                                            { value: 'contain', label: 'Contain' },
                                        ] }
                                        onChange={ ( value ) => setAttributes( { backgroundImageSize: value } ) }
                                    />
                                </>
                            ) }

                            <BaseControl label={ __( 'Overlay Color', 'apg-hero' ) }>
                                <ColorPicker
                                    color={ overlayColor }
                                    onChange={ ( value ) => setAttributes( { overlayColor: value } ) }
                                    enableAlpha
                                />
                            </BaseControl>

                            <RangeControl
                                label={ __( 'Overlay Opacity', 'apg-hero' ) }
                                value={ overlayOpacity }
                                onChange={ ( value ) => setAttributes( { overlayOpacity: value } ) }
                                min={ 0 }
                                max={ 1 }
                                step={ 0.1 }
                            />
                        </PanelBody>

                        <PanelBody title={ __( 'Layout', 'apg-hero' ) } initialOpen={ false }>
                            <p style={ { fontWeight: 'bold', margin: '0 0 8px 0' } }>{ __( 'Content Max Width', 'apg-hero' ) }</p>
                            <div style={ { display: 'grid', gridTemplateColumns: '1fr auto 80px', gap: '8px', alignItems: 'center', marginBottom: '16px' } }>
                                <input
                                    type="number"
                                    value={ contentMaxWidth?.value ?? 1200 }
                                    onChange={ ( e ) => setAttributes( { contentMaxWidth: { ...contentMaxWidth, value: parseFloat( e.target.value ) || 0 } } ) }
                                    min={ 0 }
                                    style={ { width: '100%', padding: '4px 8px' } }
                                />
                                <SelectControl
                                    value={ contentMaxWidth?.unit ?? 'px' }
                                    options={ UNIT_OPTIONS }
                                    onChange={ ( value ) => setAttributes( { contentMaxWidth: { ...contentMaxWidth, unit: value } } ) }
                                    style={ { width: '60px', margin: 0 } }
                                />
                            </div>

                            <SelectControl
                                label={ __( 'Content Position', 'apg-hero' ) }
                                value={ contentPosition }
                                options={ [
                                    { value: 'left', label: __( 'Left', 'apg-hero' ) },
                                    { value: 'center', label: __( 'Center', 'apg-hero' ) },
                                    { value: 'right', label: __( 'Right', 'apg-hero' ) },
                                ] }
                                onChange={ ( value ) => setAttributes( { contentPosition: value } ) }
                            />

                            <SelectControl
                                label={ __( 'Vertical Align', 'apg-hero' ) }
                                value={ verticalAlign }
                                options={ [
                                    { value: 'top', label: __( 'Top', 'apg-hero' ) },
                                    { value: 'center', label: __( 'Center', 'apg-hero' ) },
                                    { value: 'bottom', label: __( 'Bottom', 'apg-hero' ) },
                                ] }
                                onChange={ ( value ) => setAttributes( { verticalAlign: value } ) }
                            />
                        </PanelBody>

                        <PanelBody title={ __( 'Spacing', 'apg-hero' ) } initialOpen={ false }>
                            <BaseControl label={ __( 'Device', 'apg-hero' ) }>
                                <Button
                                    isPressed={ deviceType === 'desktop' }
                                    onClick={ () => setDeviceType( 'desktop' ) }
                                    variant="secondary"
                                    style={ { marginRight: '4px' } }
                                >
                                    D
                                </Button>
                                <Button
                                    isPressed={ deviceType === 'tablet' }
                                    onClick={ () => setDeviceType( 'tablet' ) }
                                    variant="secondary"
                                    style={ { marginRight: '4px' } }
                                >
                                    T
                                </Button>
                                <Button
                                    isPressed={ deviceType === 'mobile' }
                                    onClick={ () => setDeviceType( 'mobile' ) }
                                    variant="secondary"
                                >
                                    M
                                </Button>
                            </BaseControl>

                            <p style={ { marginTop: '16px', marginBottom: '8px', fontWeight: 'bold' } }>
                                Padding
                            </p>
                            <div style={ { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } }>
                                <RangeControl
                                    label={ __( 'Top', 'apg-hero' ) }
                                    value={ getPadding()[ 0 ] }
                                    onChange={ ( value ) => updatePadding( 0, value ) }
                                    min={ 0 }
                                    max={ 200 }
                                />
                                <RangeControl
                                    label={ __( 'Right', 'apg-hero' ) }
                                    value={ getPadding()[ 1 ] }
                                    onChange={ ( value ) => updatePadding( 1, value ) }
                                    min={ 0 }
                                    max={ 200 }
                                />
                                <RangeControl
                                    label={ __( 'Bottom', 'apg-hero' ) }
                                    value={ getPadding()[ 2 ] }
                                    onChange={ ( value ) => updatePadding( 2, value ) }
                                    min={ 0 }
                                    max={ 200 }
                                />
                                <RangeControl
                                    label={ __( 'Left', 'apg-hero' ) }
                                    value={ getPadding()[ 3 ] }
                                    onChange={ ( value ) => updatePadding( 3, value ) }
                                    min={ 0 }
                                    max={ 200 }
                                />
                            </div>
                        </PanelBody>
                    </>
                ) }

                { activeTab === 'advanced' && (
                    <>
                        <PanelBody title={ __( 'Custom CSS', 'apg-hero' ) } initialOpen={ true }>
                            <CustomCSSEditor
                                label={ __( 'Custom CSS', 'apg-hero' ) }
                                value={ customCSS || '' }
                                onChange={ ( value ) => setAttributes( { customCSS: value } ) }
                            />
                        </PanelBody>
                    </>
                ) }
            </InspectorControls>

            { fullCSS && (
                <style>{ fullCSS }</style>
            ) }

            <div { ...blockProps }>
                <div className="apg-hero__inner">
                    <div className="apg-hero__content">
                        <InnerBlocks
                            allowedBlocks={ undefined }
                            template={ [
                                [ 'core/paragraph', { placeholder: 'Añade tu contenido aquí...' } ],
                            ] }
                        />
                    </div>
                </div>
                { maskEnabled && (
                    <div 
                        className="apg-hero__masked-image" 
                        data-position={ maskPositionPreset }
                        style={ maskPositionPreset === 'custom' ? getCustomPositionStyle() : {} }
                    >
                        { maskedImageUrl && (
                            <img src={ maskedImageUrl } alt="" />
                        ) }
                    </div>
                ) }
            </div>
        </>
    );
}
