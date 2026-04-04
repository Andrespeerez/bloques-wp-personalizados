import { useBlockProps } from '@wordpress/block-editor';

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

export default function save( { attributes } ) {
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
        customCSS,
        uniqueID,
    } = attributes;

    const blockProps = useBlockProps.save( {
        className: `apg-google-reviews${ uniqueID ? ' apg-google-reviews-' + uniqueID : '' }`,
    } );

    const blockCSS = uniqueID ? generateBlockCSS( uniqueID, {
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
    } ) : '';
    const fullCSS = blockCSS + ( customCSS || '' );

    return (
        <>
            { fullCSS && <style>{ fullCSS }</style> }
            <div { ...blockProps }>
                <InnerBlocks.Content />
            </div>
        </>
    );
}
