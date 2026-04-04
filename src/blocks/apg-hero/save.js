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
        maskCustomPosition,
        maskWidth,
        maskHeight,
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

    css += `.apg-hero-${ uniqueId } .apg-hero__inner {\n`;
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
        maskCustomPosition,
        maskWidth,
        maskHeight,
        contentPosition,
        verticalAlign,
        paddingDesktop,
        paddingTablet,
        paddingMobile,
        customCSS,
        uniqueID,
    } = attributes;

    const getCustomPositionStyle = () => {
        if ( maskPositionPreset !== 'custom' || !maskCustomPosition ) return {};
        const style = {};
        
        if ( maskCustomPosition.left?.value !== '' ) {
            style.left = maskCustomPosition.left.value + maskCustomPosition.left.unit;
            style.right = 'auto';
        }
        if ( maskCustomPosition.right?.value !== '' ) {
            style.right = maskCustomPosition.right.value + maskCustomPosition.right.unit;
            style.left = 'auto';
        }
        if ( maskCustomPosition.top?.value !== '' ) {
            style.top = maskCustomPosition.top.value + maskCustomPosition.top.unit;
            style.bottom = 'auto';
        }
        if ( maskCustomPosition.bottom?.value !== '' ) {
            style.bottom = maskCustomPosition.bottom.value + maskCustomPosition.bottom.unit;
            style.top = 'auto';
        }
        return style;
    };

    const blockProps = useBlockProps.save( {
        className: `apg-hero${ uniqueID ? ' apg-hero-' + uniqueID : '' }`,
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
        maskCustomPosition,
        maskWidth,
        maskHeight,
        contentPosition,
        verticalAlign,
        paddingDesktop,
        paddingTablet: paddingTablet || [200, 24, 48, 24],
        paddingMobile: paddingMobile || [180, 20, 40, 20],
    } ) : '';
    const fullCSS = blockCSS + ( customCSS || '' );

    return (
        <>
            { fullCSS && (
                <style>{ fullCSS }</style>
            ) }
            <div { ...blockProps }>
                <div className="apg-hero__inner">
                    <div className="apg-hero__content">
                        <InnerBlocks.Content />
                    </div>
                </div>
                { maskEnabled && maskedImageUrl && (
                    <div 
                        className="apg-hero__masked-image" 
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
