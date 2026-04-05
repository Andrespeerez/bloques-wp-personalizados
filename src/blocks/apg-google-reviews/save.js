import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
    const { uniqueID } = attributes;

    const blockProps = useBlockProps.save( {
        className: `apg-google-reviews${ uniqueID ? ' apg-google-reviews-' + uniqueID : '' }`,
    } );

    return (
        <div { ...blockProps }>
            <InnerBlocks.Content />
        </div>
    );
}
