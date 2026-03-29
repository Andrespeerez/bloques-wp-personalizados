/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
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
            '--ds-padding-top': paddingDesktop[ 0 ] + 'px',
            '--ds-padding-right': paddingDesktop[ 1 ] + 'px',
            '--ds-padding-bottom': paddingDesktop[ 2 ] + 'px',
            '--ds-padding-left': paddingDesktop[ 3 ] + 'px',
            '--ds-padding-top-tablet': attributes.paddingTablet[ 0 ] + 'px',
            '--ds-padding-right-tablet': attributes.paddingTablet[ 1 ] + 'px',
            '--ds-padding-bottom-tablet': attributes.paddingTablet[ 2 ] + 'px',
            '--ds-padding-left-tablet': attributes.paddingTablet[ 3 ] + 'px',
            '--ds-padding-top-mobile': attributes.paddingMobile[ 0 ] + 'px',
            '--ds-padding-right-mobile': attributes.paddingMobile[ 1 ] + 'px',
            '--ds-padding-bottom-mobile': attributes.paddingMobile[ 2 ] + 'px',
            '--ds-padding-left-mobile': attributes.paddingMobile[ 3 ] + 'px',
        },
    } );

    return (
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
    );
}
