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

import { useState } from '@wordpress/element';

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

export default function Edit( { attributes, setAttributes } ) {
    const {
        backgroundType,
        backgroundColor,
        backgroundGradient,
        backgroundImage,
        backgroundImagePosition,
        backgroundImageSize,
        backgroundImageRepeat,
        backgroundImageAttachment,
        overlayColor,
        overlayOpacity,
        maskEnabled,
        maskedImageUrl,
        maskedImageId,
        maskImageUrl,
        maskImageId,
        maskPositionPreset,
        maskPositionX,
        maskPositionY,
        maskPositionXUnit,
        maskPositionYUnit,
        maskWidth,
        maskHeight,
        contentPosition,
        verticalAlign,
        paddingDesktop,
        paddingTablet,
        paddingMobile,
    } = attributes;

    const [ deviceType, setDeviceType ] = useState( 'desktop' );

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

    const getCustomPositionCSS = () => {
        const css = {};
        if ( maskPositionX !== '' && maskPositionPreset === 'custom' ) {
            if ( maskPositionXUnit === '%' ) {
                css.left = maskPositionX + '%';
                css.right = 'auto';
            } else {
                css.left = maskPositionX + 'px';
                css.right = 'auto';
            }
        }
        if ( maskPositionY !== '' && maskPositionPreset === 'custom' ) {
            if ( maskPositionYUnit === '%' ) {
                css.top = maskPositionY + '%';
                css.bottom = 'auto';
            } else {
                css.top = maskPositionY + 'px';
                css.bottom = 'auto';
            }
        }
        return css;
    };

    const blockProps = useBlockProps( {
        className: `ds-hero ds-hero--content-${ contentPosition } ds-hero--vertical-${ verticalAlign }`,
        'data-bg-type': backgroundType,
        style: {
            '--ds-bg-color': backgroundColor,
            '--ds-bg-gradient': backgroundGradient,
            '--ds-bg-image': backgroundImage?.url ? `url(${ backgroundImage.url })` : undefined,
            '--ds-bg-position': backgroundImagePosition,
            '--ds-bg-size': backgroundImageSize,
            '--ds-bg-repeat': backgroundImageRepeat ? 'repeat' : 'no-repeat',
            '--ds-bg-attachment': backgroundImageAttachment,
            '--ds-overlay-color': overlayColor,
            '--ds-overlay-opacity': overlayOpacity,
            '--ds-mask-image': maskImageUrl ? `url(${ maskImageUrl })` : undefined,
            '--ds-mask-size': 'cover',
            '--ds-mask-width': maskWidth + 'px',
            '--ds-mask-height': maskHeight + 'px',
            '--ds-padding-top': getPadding()[ 0 ] + 'px',
            '--ds-padding-right': getPadding()[ 1 ] + 'px',
            '--ds-padding-bottom': getPadding()[ 2 ] + 'px',
            '--ds-padding-left': getPadding()[ 3 ] + 'px',
            '--ds-padding-top-tablet': paddingTablet[ 0 ] + 'px',
            '--ds-padding-right-tablet': paddingTablet[ 1 ] + 'px',
            '--ds-padding-bottom-tablet': paddingTablet[ 2 ] + 'px',
            '--ds-padding-left-tablet': paddingTablet[ 3 ] + 'px',
            '--ds-padding-top-mobile': paddingMobile[ 0 ] + 'px',
            '--ds-padding-right-mobile': paddingMobile[ 1 ] + 'px',
            '--ds-padding-bottom-mobile': paddingMobile[ 2 ] + 'px',
            '--ds-padding-left-mobile': paddingMobile[ 3 ] + 'px',
        },
    } );

    return (
        <>
            <InspectorControls>
                <PanelBody title={ __( 'Background', 'ds-hero' ) } initialOpen={ true }>
                    <BaseControl label={ __( 'Device Preview', 'ds-hero' ) }>
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

                    <SelectControl
                        label={ __( 'Background Type', 'ds-hero' ) }
                        value={ backgroundType }
                        options={ [
                            { value: 'color', label: __( 'Color', 'ds-hero' ) },
                            { value: 'gradient', label: __( 'Gradient', 'ds-hero' ) },
                            { value: 'image', label: __( 'Image', 'ds-hero' ) },
                        ] }
                        onChange={ ( value ) => setAttributes( { backgroundType: value } ) }
                    />

                    { backgroundType === 'color' && (
                        <BaseControl label={ __( 'Background Color', 'ds-hero' ) }>
                            <ColorPicker
                                color={ backgroundColor }
                                onChange={ ( value ) => setAttributes( { backgroundColor: value } ) }
                                enableAlpha
                            />
                        </BaseControl>
                    ) }

                    { backgroundType === 'gradient' && (
                        <BaseControl label={ __( 'Gradient', 'ds-hero' ) }>
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
                            <BaseControl label={ __( 'Background Image', 'ds-hero' ) }>
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
                                                    focalPoint: backgroundImage.focalPoint || { x: 0.5, y: 0.5 },
                                                },
                                            } );
                                        } }
                                        onRemoveMedia={ () => {
                                            setAttributes( {
                                                backgroundImage: {
                                                    url: '',
                                                    id: 0,
                                                    size: 'cover',
                                                    focalPoint: { x: 0.5, y: 0.5 },
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
                                                    focalPoint: { x: 0.5, y: 0.5 },
                                                },
                                            } );
                                        } }
                                        accept="image/*"
                                        allowedTypes={ [ 'image' ] }
                                    />
                                ) }
                            </BaseControl>

                            <SelectControl
                                label={ __( 'Position', 'ds-hero' ) }
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
                                label={ __( 'Size', 'ds-hero' ) }
                                value={ backgroundImageSize }
                                options={ [
                                    { value: 'auto', label: 'Auto' },
                                    { value: 'cover', label: 'Cover' },
                                    { value: 'contain', label: 'Contain' },
                                ] }
                                onChange={ ( value ) => setAttributes( { backgroundImageSize: value } ) }
                            />

                            <BaseControl label={ __( 'Overlay Color', 'ds-hero' ) }>
                                <ColorPicker
                                    color={ overlayColor }
                                    onChange={ ( value ) => setAttributes( { overlayColor: value } ) }
                                    enableAlpha
                                />
                            </BaseControl>

                            <RangeControl
                                label={ __( 'Overlay Opacity', 'ds-hero' ) }
                                value={ overlayOpacity }
                                onChange={ ( value ) => setAttributes( { overlayOpacity: value } ) }
                                min={ 0 }
                                max={ 1 }
                                step={ 0.1 }
                            />
                        </>
                    ) }
                </PanelBody>

                <PanelBody title={ __( 'Masked Image', 'ds-hero' ) } initialOpen={ false }>
                    <ToggleControl
                        label={ __( 'Enable Masked Image', 'ds-hero' ) }
                        checked={ maskEnabled }
                        onChange={ ( value ) => setAttributes( { maskEnabled: value } ) }
                    />

                    { maskEnabled && (
                        <>
                            <BaseControl label={ __( 'Image to Mask', 'ds-hero' ) }>
                                <p style={ { fontSize: '12px', color: '#666', marginBottom: '8px' } }>
                                    { __( 'Upload the image you want to display.', 'ds-hero' ) }
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

                            <BaseControl label={ __( 'Mask (PNG with transparency)', 'ds-hero' ) }>
                                <p style={ { fontSize: '12px', color: '#666', marginBottom: '8px' } }>
                                    { __( 'Upload a PNG image with transparency to use as a mask.', 'ds-hero' ) }
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
                                label={ __( 'Position', 'ds-hero' ) }
                                value={ maskPositionPreset }
                                options={ MASK_POSITION_OPTIONS }
                                onChange={ ( value ) => setAttributes( { maskPositionPreset: value } ) }
                            />

                            { maskPositionPreset === 'custom' && (
                                <>
                                    <div style={ { display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '8px', alignItems: 'center', marginTop: '16px' } }>
                                        <RangeControl
                                            label={ __( 'X Position', 'ds-hero' ) }
                                            value={ maskPositionX }
                                            onChange={ ( value ) => setAttributes( { maskPositionX: value } ) }
                                            min={ 0 }
                                            max={ 100 }
                                        />
                                        <SelectControl
                                            value={ maskPositionXUnit }
                                            options={ UNIT_OPTIONS }
                                            onChange={ ( value ) => setAttributes( { maskPositionXUnit: value } ) }
                                            style={ { width: '60px' } }
                                        />
                                        <RangeControl
                                            label={ __( 'Y Position', 'ds-hero' ) }
                                            value={ maskPositionY }
                                            onChange={ ( value ) => setAttributes( { maskPositionY: value } ) }
                                            min={ 0 }
                                            max={ 100 }
                                        />
                                    </div>
                                </>
                            ) }

                            <div style={ { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' } }>
                                <RangeControl
                                    label={ __( 'Width (px)', 'ds-hero' ) }
                                    value={ maskWidth }
                                    onChange={ ( value ) => setAttributes( { maskWidth: value } ) }
                                    min={ 50 }
                                    max={ 1000 }
                                />
                                <RangeControl
                                    label={ __( 'Height (px)', 'ds-hero' ) }
                                    value={ maskHeight }
                                    onChange={ ( value ) => setAttributes( { maskHeight: value } ) }
                                    min={ 50 }
                                    max={ 1000 }
                                />
                            </div>
                        </>
                    ) }
                </PanelBody>

                <PanelBody title={ __( 'Layout', 'ds-hero' ) } initialOpen={ false }>
                    <SelectControl
                        label={ __( 'Content Position', 'ds-hero' ) }
                        value={ contentPosition }
                        options={ [
                            { value: 'left', label: __( 'Left', 'ds-hero' ) },
                            { value: 'center', label: __( 'Center', 'ds-hero' ) },
                            { value: 'right', label: __( 'Right', 'ds-hero' ) },
                        ] }
                        onChange={ ( value ) => setAttributes( { contentPosition: value } ) }
                    />

                    <SelectControl
                        label={ __( 'Vertical Align', 'ds-hero' ) }
                        value={ verticalAlign }
                        options={ [
                            { value: 'top', label: __( 'Top', 'ds-hero' ) },
                            { value: 'center', label: __( 'Center', 'ds-hero' ) },
                            { value: 'bottom', label: __( 'Bottom', 'ds-hero' ) },
                        ] }
                        onChange={ ( value ) => setAttributes( { verticalAlign: value } ) }
                    />
                </PanelBody>

                <PanelBody title={ __( 'Spacing', 'ds-hero' ) } initialOpen={ false }>
                    <BaseControl label={ __( 'Device', 'ds-hero' ) }>
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
                            label={ __( 'Top', 'ds-hero' ) }
                            value={ getPadding()[ 0 ] }
                            onChange={ ( value ) => updatePadding( 0, value ) }
                            min={ 0 }
                            max={ 200 }
                        />
                        <RangeControl
                            label={ __( 'Right', 'ds-hero' ) }
                            value={ getPadding()[ 1 ] }
                            onChange={ ( value ) => updatePadding( 1, value ) }
                            min={ 0 }
                            max={ 200 }
                        />
                        <RangeControl
                            label={ __( 'Bottom', 'ds-hero' ) }
                            value={ getPadding()[ 2 ] }
                            onChange={ ( value ) => updatePadding( 2, value ) }
                            min={ 0 }
                            max={ 200 }
                        />
                        <RangeControl
                            label={ __( 'Left', 'ds-hero' ) }
                            value={ getPadding()[ 3 ] }
                            onChange={ ( value ) => updatePadding( 3, value ) }
                            min={ 0 }
                            max={ 200 }
                        />
                    </div>
                </PanelBody>
            </InspectorControls>

            <div { ...blockProps }>
                <div className="ds-hero__inner">
                    <div className="ds-hero__content">
                        <InnerBlocks
                            allowedBlocks={ [ 'core/heading', 'core/paragraph', 'core/buttons', 'core/button', 'core/image' ] }
                            template={ [
                                [ 'core/paragraph', { placeholder: 'Añade tu contenido aquí...' } ],
                            ] }
                        />
                    </div>
                </div>
                { maskEnabled && (
                    <div 
                        className="ds-hero__masked-image" 
                        data-position={ maskPositionPreset }
                        style={ maskPositionPreset === 'custom' ? getCustomPositionCSS() : {} }
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
