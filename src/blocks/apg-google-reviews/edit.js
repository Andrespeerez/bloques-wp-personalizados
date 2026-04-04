import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, RangeControl, ToggleControl, Button, BaseControl, ColorPicker, SelectControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import CustomCSSEditor from './custom-css-editor';
import './editor.scss';

const MOCK_REVIEW = {
    author_name: 'María García',
    rating: 5,
    text: 'La mejor experiencia que he tenido. Totalmente recomendable.',
    relative_time_description: 'hace 5 días',
    profile_photo_url: 'https://i.pravatar.cc/150?img=5'
};

function InspectorTabs( { currentTab, onTabChange } ) {
    const tabs = [
        { name: 'general', title: __( 'General', 'apg-google-reviews' ) },
        { name: 'style', title: __( 'Style', 'apg-google-reviews' ) },
        { name: 'advanced', title: __( 'Advanced', 'apg-google-reviews' ) },
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

function ReviewCard( { review, attributes } ) {
    const {
        cardBackgroundColor,
        cardTextColor,
        cardBorderRadius,
        cardBorderWidth,
        cardBorderColor,
        avatarSize,
        avatarBorderRadius,
        nameFontSize,
        nameFontWeight,
        textFontSize,
        textLineHeight,
        timeFontSize,
        starColor,
        starEmptyColor,
    } = attributes;

    const stars = Array.from( { length: 5 }, ( _, i ) => i < review.rating );

    return (
        <div
            className="apg-reviews-card"
            style={ {
                backgroundColor: cardBackgroundColor,
                color: cardTextColor,
                borderRadius: `${ cardBorderRadius }px`,
                borderWidth: `${ cardBorderWidth }px`,
                borderColor: cardBorderColor,
                borderStyle: cardBorderWidth > 0 ? 'solid' : 'none',
                padding: '20px',
            } }
        >
            <div className="apg-reviews-header">
                { review.profile_photo_url && (
                    <img
                        src={ review.profile_photo_url }
                        alt=""
                        className="apg-reviews-avatar"
                        style={ {
                            width: `${ avatarSize }px`,
                            height: `${ avatarSize }px`,
                            borderRadius: `${ avatarBorderRadius }%`,
                        } }
                    />
                ) }
                <div className="apg-reviews-meta">
                    <strong
                        className="apg-reviews-name"
                        style={ {
                            fontSize: `${ nameFontSize }px`,
                            fontWeight: nameFontWeight,
                        } }
                    >
                        { review.author_name }
                    </strong>
                    <div className="apg-reviews-rating">
                        { stars.map( ( filled, i ) => (
                            <span
                                key={ i }
                                style={ { color: filled ? starColor : starEmptyColor } }
                            >
                                ★
                            </span>
                        ) ) }
                    </div>
                </div>
            </div>
            <p
                className="apg-reviews-text"
                style={ {
                    fontSize: `${ textFontSize }px`,
                    lineHeight: textLineHeight,
                } }
            >
                "{ review.text }"
            </p>
            <time
                className="apg-reviews-time"
                style={ { fontSize: `${ timeFontSize }px` } }
            >
                { review.relative_time_description }
            </time>
        </div>
    );
}

function generateBlockCSS( uniqueId, attributes ) {
    const {
        cardBackgroundColor,
        cardTextColor,
        cardBorderRadius,
        cardBorderRadiusTablet,
        cardBorderRadiusMobile,
        cardPaddingDesktop,
        cardPaddingTablet,
        cardPaddingMobile,
        cardBorderWidth,
        cardBorderColor,
        avatarSize,
        avatarBorderRadius,
        nameFontSize,
        nameFontWeight,
        textFontSize,
        textLineHeight,
        timeFontSize,
        starColor,
        starEmptyColor,
        gapDesktop,
        gapTablet,
        gapMobile,
        layout,
        columnsDesktop,
        columnsTablet,
        columnsMobile,
    } = attributes;

    let css = `.apg-google-reviews-${ uniqueId } {\n`;
    css += `    --apg-card-bg: ${ cardBackgroundColor };\n`;
    css += `    --apg-card-text: ${ cardTextColor };\n`;
    css += `    --apg-card-radius: ${ cardBorderRadius }px;\n`;
    css += `    --apg-card-radius-tablet: ${ cardBorderRadiusTablet }px;\n`;
    css += `    --apg-card-radius-mobile: ${ cardBorderRadiusMobile }px;\n`;
    css += `    --apg-card-padding: ${ cardPaddingDesktop[ 0 ] }px ${ cardPaddingDesktop[ 1 ] }px ${ cardPaddingDesktop[ 2 ] }px ${ cardPaddingDesktop[ 3 ] }px;\n`;
    css += `    --apg-card-border-width: ${ cardBorderWidth }px;\n`;
    css += `    --apg-card-border-color: ${ cardBorderColor };\n`;
    css += `    --apg-avatar-size: ${ avatarSize }px;\n`;
    css += `    --apg-avatar-radius: ${ avatarBorderRadius }%;\n`;
    css += `    --apg-name-size: ${ nameFontSize }px;\n`;
    css += `    --apg-name-weight: ${ nameFontWeight };\n`;
    css += `    --apg-text-size: ${ textFontSize }px;\n`;
    css += `    --apg-text-line-height: ${ textLineHeight };\n`;
    css += `    --apg-time-size: ${ timeFontSize }px;\n`;
    css += `    --apg-star-color: ${ starColor };\n`;
    css += `    --apg-star-empty: ${ starEmptyColor };\n`;
    css += `    --apg-gap: ${ gapDesktop }px;\n`;
    css += `}\n\n`;

    if ( layout === 'grid' ) {
        css += `.apg-google-reviews-${ uniqueId } .apg-google-reviews-list {\n`;
        css += `    display: grid;\n`;
        css += `    grid-template-columns: repeat(${ columnsDesktop }, 1fr);\n`;
        css += `    gap: var(--apg-gap);\n`;
        css += `}\n\n`;
    } else {
        css += `.apg-google-reviews-${ uniqueId } .apg-google-reviews-list {\n`;
        css += `    display: flex;\n`;
        css += `    flex-direction: column;\n`;
        css += `    gap: var(--apg-gap);\n`;
        css += `}\n`;
    }

    css += `\n@media (max-width: 1024px) {\n`;
    css += `    .apg-google-reviews-${ uniqueId } .apg-google-reviews-card {\n`;
    css += `        border-radius: var(--apg-card-radius-tablet);\n`;
    css += `        padding: ${ cardPaddingTablet[ 0 ] }px ${ cardPaddingTablet[ 1 ] }px ${ cardPaddingTablet[ 2 ] }px ${ cardPaddingTablet[ 3 ] }px;\n`;
    if ( layout === 'grid' ) {
        css += `    }\n`;
        css += `    .apg-google-reviews-${ uniqueId } .apg-google-reviews-list {\n`;
        css += `        grid-template-columns: repeat(${ columnsTablet }, 1fr);\n`;
        css += `        gap: ${ gapTablet }px;\n`;
    }
    css += `    }\n`;
    css += `}\n\n`;

    css += `@media (max-width: 767px) {\n`;
    css += `    .apg-google-reviews-${ uniqueId } .apg-google-reviews-card {\n`;
    css += `        border-radius: var(--apg-card-radius-mobile);\n`;
    css += `        padding: ${ cardPaddingMobile[ 0 ] }px ${ cardPaddingMobile[ 1 ] }px ${ cardPaddingMobile[ 2 ] }px ${ cardPaddingMobile[ 3 ] }px;\n`;
    if ( layout === 'grid' ) {
        css += `    }\n`;
        css += `    .apg-google-reviews-${ uniqueId } .apg-google-reviews-list {\n`;
        css += `        grid-template-columns: repeat(${ columnsMobile }, 1fr);\n`;
        css += `        gap: ${ gapMobile }px;\n`;
    }
    css += `    }\n`;
    css += `}\n`;

    return css;
}

export default function Edit( { attributes, setAttributes, clientId } ) {
    const {
        uniqueID,
        placeId,
        apiKey,
        cantidad,
        cardBackgroundColor,
        cardTextColor,
        cardBorderRadius,
        cardBorderRadiusTablet,
        cardBorderRadiusMobile,
        cardPaddingDesktop,
        cardPaddingTablet,
        cardPaddingMobile,
        cardBorderWidth,
        cardBorderColor,
        avatarSize,
        avatarBorderRadius,
        nameFontSize,
        nameFontWeight,
        textFontSize,
        textLineHeight,
        timeFontSize,
        starColor,
        starEmptyColor,
        gapDesktop,
        gapTablet,
        gapMobile,
        layout,
        columnsDesktop,
        columnsTablet,
        columnsMobile,
        customCSS,
    } = attributes;

    const [ deviceType, setDeviceType ] = useState( 'desktop' );
    const [ activeTab, setActiveTab ] = useState( 'general' );

    useEffect( () => {
        if ( ! uniqueID ) {
            setAttributes( { uniqueID: generateUniqueId() } );
        }
    }, [ clientId ] );

    const getPadding = () => {
        if ( deviceType === 'mobile' ) return cardPaddingMobile;
        if ( deviceType === 'tablet' ) return cardPaddingTablet;
        return cardPaddingDesktop;
    };

    const updatePadding = ( index, value ) => {
        const padding = getPadding();
        const newPadding = [ ...padding ];
        newPadding[ index ] = value;
        if ( deviceType === 'mobile' ) {
            setAttributes( { cardPaddingMobile: newPadding } );
        } else if ( deviceType === 'tablet' ) {
            setAttributes( { cardPaddingTablet: newPadding } );
        } else {
            setAttributes( { cardPaddingDesktop: newPadding } );
        }
    };

    const getBorderRadius = () => {
        if ( deviceType === 'mobile' ) return cardBorderRadiusMobile;
        if ( deviceType === 'tablet' ) return cardBorderRadiusTablet;
        return cardBorderRadius;
    };

    const updateBorderRadius = ( value ) => {
        if ( deviceType === 'mobile' ) {
            setAttributes( { cardBorderRadiusMobile: value } );
        } else if ( deviceType === 'tablet' ) {
            setAttributes( { cardBorderRadiusTablet: value } );
        } else {
            setAttributes( { cardBorderRadius: value } );
        }
    };

    const getGap = () => {
        if ( deviceType === 'mobile' ) return gapMobile;
        if ( deviceType === 'tablet' ) return gapTablet;
        return gapDesktop;
    };

    const updateGap = ( value ) => {
        if ( deviceType === 'mobile' ) {
            setAttributes( { gapMobile: value } );
        } else if ( deviceType === 'tablet' ) {
            setAttributes( { gapTablet: value } );
        } else {
            setAttributes( { gapDesktop: value } );
        }
    };

    const getColumns = () => {
        if ( deviceType === 'mobile' ) return columnsMobile;
        if ( deviceType === 'tablet' ) return columnsTablet;
        return columnsDesktop;
    };

    const updateColumns = ( value ) => {
        if ( deviceType === 'mobile' ) {
            setAttributes( { columnsMobile: value } );
        } else if ( deviceType === 'tablet' ) {
            setAttributes( { columnsTablet: value } );
        } else {
            setAttributes( { columnsDesktop: value } );
        }
    };

    const blockProps = useBlockProps( {
        className: `apg-google-reviews${ uniqueID ? ' apg-google-reviews-' + uniqueID : '' }`,
    } );

    const blockCSS = uniqueID ? generateBlockCSS( uniqueID, attributes ) : '';
    const fullCSS = blockCSS + ( customCSS || '' );

    const isDemo = ! placeId || ! apiKey;

    return (
        <>
            <InspectorControls>
                <InspectorTabs currentTab={ activeTab } onTabChange={ setActiveTab } />

                { activeTab === 'general' && (
                    <>
                        <PanelBody title={ __( 'Google API Configuration', 'apg-google-reviews' ) } initialOpen={ true }>
                            <TextControl
                                label={ __( 'Google API Key', 'apg-google-reviews' ) }
                                value={ apiKey || '' }
                                onChange={ ( value ) => setAttributes( { apiKey: value } ) }
                                help={ __( 'Get your API Key from Google Cloud Console', 'apg-google-reviews' ) }
                            />
                            <TextControl
                                label={ __( 'Place ID', 'apg-google-reviews' ) }
                                value={ placeId || '' }
                                onChange={ ( value ) => setAttributes( { placeId: value } ) }
                                help={ __( 'Google Maps place ID (e.g: ChIJN1t_tDeuEmsRU...)', 'apg-google-reviews' ) }
                            />
                            <RangeControl
                                label={ __( 'Number of Reviews', 'apg-google-reviews' ) }
                                value={ cantidad || 4 }
                                onChange={ ( value ) => setAttributes( { cantidad: value } ) }
                                min={ 1 }
                                max={ 10 }
                            />
                        </PanelBody>

                        <PanelBody title={ __( 'Layout', 'apg-google-reviews' ) } initialOpen={ false }>
                            <SelectControl
                                label={ __( 'Display Layout', 'apg-google-reviews' ) }
                                value={ layout }
                                options={ [
                                    { value: 'list', label: __( 'List', 'apg-google-reviews' ) },
                                    { value: 'grid', label: __( 'Grid', 'apg-google-reviews' ) },
                                ] }
                                onChange={ ( value ) => setAttributes( { layout: value } ) }
                            />

                            { layout === 'grid' && (
                                <>
                                    <BaseControl label={ __( 'Columns (Device)', 'apg-google-reviews' ) }>
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
                                    <RangeControl
                                        label={ __( 'Columns', 'apg-google-reviews' ) }
                                        value={ getColumns() }
                                        onChange={ updateColumns }
                                        min={ 1 }
                                        max={ 4 }
                                    />
                                </>
                            ) }
                        </PanelBody>
                    </>
                ) }

                { activeTab === 'style' && (
                    <>
                        <PanelBody title={ __( 'Card', 'apg-google-reviews' ) } initialOpen={ true }>
                            <BaseControl label={ __( 'Device', 'apg-google-reviews' ) }>
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

                            <BaseControl label={ __( 'Background Color', 'apg-google-reviews' ) }>
                                <ColorPicker
                                    color={ cardBackgroundColor }
                                    onChange={ ( value ) => setAttributes( { cardBackgroundColor: value } ) }
                                    enableAlpha
                                />
                            </BaseControl>

                            <BaseControl label={ __( 'Text Color', 'apg-google-reviews' ) }>
                                <ColorPicker
                                    color={ cardTextColor }
                                    onChange={ ( value ) => setAttributes( { cardTextColor: value } ) }
                                    enableAlpha
                                />
                            </BaseControl>

                            <RangeControl
                                label={ __( 'Border Radius', 'apg-google-reviews' ) }
                                value={ getBorderRadius() }
                                onChange={ updateBorderRadius }
                                min={ 0 }
                                max={ 50 }
                            />

                            <RangeControl
                                label={ __( 'Border Width', 'apg-google-reviews' ) }
                                value={ cardBorderWidth }
                                onChange={ ( value ) => setAttributes( { cardBorderWidth: value } ) }
                                min={ 0 }
                                max={ 10 }
                            />

                            { cardBorderWidth > 0 && (
                                <BaseControl label={ __( 'Border Color', 'apg-google-reviews' ) }>
                                    <ColorPicker
                                        color={ cardBorderColor }
                                        onChange={ ( value ) => setAttributes( { cardBorderColor: value } ) }
                                        enableAlpha
                                    />
                                </BaseControl>
                            ) }

                            <p style={ { marginTop: '16px', marginBottom: '8px', fontWeight: 'bold' } }>
                                { __( 'Padding', 'apg-google-reviews' ) }
                            </p>
                            <div style={ { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } }>
                                <RangeControl
                                    label={ __( 'Top', 'apg-google-reviews' ) }
                                    value={ getPadding()[ 0 ] }
                                    onChange={ ( value ) => updatePadding( 0, value ) }
                                    min={ 0 }
                                    max={ 60 }
                                />
                                <RangeControl
                                    label={ __( 'Right', 'apg-google-reviews' ) }
                                    value={ getPadding()[ 1 ] }
                                    onChange={ ( value ) => updatePadding( 1, value ) }
                                    min={ 0 }
                                    max={ 60 }
                                />
                                <RangeControl
                                    label={ __( 'Bottom', 'apg-google-reviews' ) }
                                    value={ getPadding()[ 2 ] }
                                    onChange={ ( value ) => updatePadding( 2, value ) }
                                    min={ 0 }
                                    max={ 60 }
                                />
                                <RangeControl
                                    label={ __( 'Left', 'apg-google-reviews' ) }
                                    value={ getPadding()[ 3 ] }
                                    onChange={ ( value ) => updatePadding( 3, value ) }
                                    min={ 0 }
                                    max={ 60 }
                                />
                            </div>
                        </PanelBody>

                        <PanelBody title={ __( 'Avatar', 'apg-google-reviews' ) } initialOpen={ false }>
                            <RangeControl
                                label={ __( 'Size (px)', 'apg-google-reviews' ) }
                                value={ avatarSize }
                                onChange={ ( value ) => setAttributes( { avatarSize: value } ) }
                                min={ 24 }
                                max={ 100 }
                            />
                            <RangeControl
                                label={ __( 'Border Radius (%)', 'apg-google-reviews' ) }
                                value={ avatarBorderRadius }
                                onChange={ ( value ) => setAttributes( { avatarBorderRadius: value } ) }
                                min={ 0 }
                                max={ 50 }
                            />
                        </PanelBody>

                        <PanelBody title={ __( 'Typography', 'apg-google-reviews' ) } initialOpen={ false }>
                            <p style={ { marginBottom: '12px', fontWeight: 'bold' } }>
                                { __( 'Author Name', 'apg-google-reviews' ) }
                            </p>
                            <RangeControl
                                label={ __( 'Font Size', 'apg-google-reviews' ) }
                                value={ nameFontSize }
                                onChange={ ( value ) => setAttributes( { nameFontSize: value } ) }
                                min={ 12 }
                                max={ 32 }
                            />
                            <SelectControl
                                label={ __( 'Font Weight', 'apg-google-reviews' ) }
                                value={ nameFontWeight }
                                options={ [
                                    { value: '400', label: 'Normal' },
                                    { value: '500', label: 'Medium' },
                                    { value: '600', label: 'Semi Bold' },
                                    { value: '700', label: 'Bold' },
                                ] }
                                onChange={ ( value ) => setAttributes( { nameFontWeight: value } ) }
                            />

                            <p style={ { marginTop: '20px', marginBottom: '12px', fontWeight: 'bold' } }>
                                { __( 'Review Text', 'apg-google-reviews' ) }
                            </p>
                            <RangeControl
                                label={ __( 'Font Size', 'apg-google-reviews' ) }
                                value={ textFontSize }
                                onChange={ ( value ) => setAttributes( { textFontSize: value } ) }
                                min={ 12 }
                                max={ 24 }
                            />
                            <RangeControl
                                label={ __( 'Line Height', 'apg-google-reviews' ) }
                                value={ textLineHeight }
                                onChange={ ( value ) => setAttributes( { textLineHeight: value } ) }
                                min={ 1 }
                                max={ 2.5 }
                                step={ 0.1 }
                            />

                            <p style={ { marginTop: '20px', marginBottom: '12px', fontWeight: 'bold' } }>
                                { __( 'Time', 'apg-google-reviews' ) }
                            </p>
                            <RangeControl
                                label={ __( 'Font Size', 'apg-google-reviews' ) }
                                value={ timeFontSize }
                                onChange={ ( value ) => setAttributes( { timeFontSize: value } ) }
                                min={ 10 }
                                max={ 20 }
                            />
                        </PanelBody>

                        <PanelBody title={ __( 'Stars', 'apg-google-reviews' ) } initialOpen={ false }>
                            <BaseControl label={ __( 'Filled Star Color', 'apg-google-reviews' ) }>
                                <ColorPicker
                                    color={ starColor }
                                    onChange={ ( value ) => setAttributes( { starColor: value } ) }
                                />
                            </BaseControl>
                            <BaseControl label={ __( 'Empty Star Color', 'apg-google-reviews' ) }>
                                <ColorPicker
                                    color={ starEmptyColor }
                                    onChange={ ( value ) => setAttributes( { starEmptyColor: value } ) }
                                />
                            </BaseControl>
                        </PanelBody>

                        <PanelBody title={ __( 'Spacing', 'apg-google-reviews' ) } initialOpen={ false }>
                            <BaseControl label={ __( 'Device', 'apg-google-reviews' ) }>
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
                            <RangeControl
                                label={ __( 'Gap Between Cards', 'apg-google-reviews' ) }
                                value={ getGap() }
                                onChange={ updateGap }
                                min={ 0 }
                                max={ 60 }
                            />
                        </PanelBody>
                    </>
                ) }

                { activeTab === 'advanced' && (
                    <PanelBody title={ __( 'Custom CSS', 'apg-google-reviews' ) } initialOpen={ true }>
                        <CustomCSSEditor
                            label={ __( 'Custom CSS', 'apg-google-reviews' ) }
                            value={ customCSS || '' }
                            onChange={ ( value ) => setAttributes( { customCSS: value } ) }
                        />
                    </PanelBody>
                ) }
            </InspectorControls>

            { fullCSS && <style>{ fullCSS }</style> }

            <div { ...blockProps }>
                { isDemo ? (
                    <div className="apg-google-reviews-demo">
                        <p className="apg-google-reviews-demo-label">
                            { __( 'Preview (Demo Mode)', 'apg-google-reviews' ) }
                        </p>
                        <div className="apg-google-reviews-list">
                            <ReviewCard review={ MOCK_REVIEW } attributes={ attributes } />
                        </div>
                    </div>
                ) : (
                    <div className="apg-google-reviews-preview">
                        <p className="apg-google-reviews-preview-label">
                            { __( 'Preview', 'apg-google-reviews' ) }
                        </p>
                        <div className="apg-google-reviews-list">
                            <ReviewCard review={ MOCK_REVIEW } attributes={ attributes } />
                        </div>
                    </div>
                ) }
            </div>
        </>
    );
}
