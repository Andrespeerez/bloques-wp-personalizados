/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

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

    let css = `.ds-hero-${ uniqueId } {\n`;
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

    css += `.ds-hero-${ uniqueId }::before {\n`;
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

    css += `.ds-hero-${ uniqueId } .ds-hero__inner {\n`;
    css += `    justify-content: ${ contentPosition === 'center' ? 'center' : ( contentPosition === 'right' ? 'flex-end' : 'flex-start' ) };\n`;
    css += `    align-items: ${ verticalAlign === 'top' ? 'flex-start' : ( verticalAlign === 'bottom' ? 'flex-end' : 'center' ) };\n`;
    css += `}\n\n`;

    if ( maskEnabled && maskImageUrl ) {
        css += `.ds-hero-${ uniqueId } .ds-hero__masked-image {\n`;
        css += `    mask-image: url(${ maskImageUrl });\n`;
        css += `    -webkit-mask-image: url(${ maskImageUrl });\n`;
        css += `    width: ${ maskWidth }px;\n`;
        css += `    height: ${ maskHeight }px;\n`;
        css += `}\n\n`;

        if ( maskPositionPreset === 'custom' ) {
            css += `.ds-hero-${ uniqueId } .ds-hero__masked-image {\n`;
            if ( maskPositionX !== '' ) {
                css += `    left: ${ maskPositionX }${ maskPositionXUnit };\n`;
                css += `    right: auto;\n`;
            }
            if ( maskPositionY !== '' ) {
                css += `    top: ${ maskPositionY }${ maskPositionYUnit };\n`;
                css += `    bottom: auto;\n`;
            }
            css += `}\n\n`;
        }
    }

    css += `@media (max-width: 1024px) {\n`;
    css += `    .ds-hero-${ uniqueId } {\n`;
    css += `        padding: ${ paddingTablet[ 0 ] }px ${ paddingTablet[ 1 ] }px ${ paddingTablet[ 2 ] }px ${ paddingTablet[ 3 ] }px;\n`;
    css += `    }\n`;
    css += `}\n\n`;

    css += `@media (max-width: 767px) {\n`;
    css += `    .ds-hero-${ uniqueId } {\n`;
    css += `        padding: ${ paddingMobile[ 0 ] }px ${ paddingMobile[ 1 ] }px ${ paddingMobile[ 2 ] }px ${ paddingMobile[ 3 ] }px;\n`;
    css += `    }\n`;
    css += `}\n`;

    return css;
}

export default function save( { attributes } ) {
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
        maskImageUrl,
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
        customCSS,
        uniqueID,
    } = attributes;

    const getCustomPositionStyle = () => {
        if ( maskPositionPreset !== 'custom' ) return {};
        const style = {};
        if ( maskPositionX !== '' ) {
            style.left = maskPositionX + maskPositionXUnit;
            style.right = 'auto';
        }
        if ( maskPositionY !== '' ) {
            style.top = maskPositionY + maskPositionYUnit;
            style.bottom = 'auto';
        }
        return style;
    };

    const blockProps = useBlockProps.save( {
        className: `ds-hero${ uniqueID ? ' ds-hero-' + uniqueID : '' }`,
    } );

    const blockCSS = uniqueID ? generateBlockCSS( uniqueID, {
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
        maskPositionX,
        maskPositionY,
        maskPositionXUnit,
        maskPositionYUnit,
        maskWidth,
        maskHeight,
        contentPosition,
        verticalAlign,
        paddingDesktop,
        paddingTablet: attributes.paddingTablet || [200, 24, 48, 24],
        paddingMobile: attributes.paddingMobile || [180, 20, 40, 20],
    } ) : '';
    const fullCSS = blockCSS + ( customCSS || '' );

    return (
        <>
            { fullCSS && (
                <style>{ fullCSS }</style>
            ) }
            <div { ...blockProps }>
                <div className="ds-hero__inner">
                    <div className="ds-hero__content">
                        <InnerBlocks.Content />
                    </div>
                </div>
                { maskEnabled && maskedImageUrl && (
                    <div 
                        className="ds-hero__masked-image" 
                        data-position={ maskPositionPreset }
                        style={ getCustomPositionStyle() }
                    >
                        <img src={ maskedImageUrl } alt="" />
                    </div>
                ) }
            </div>
        </>
    );
}
