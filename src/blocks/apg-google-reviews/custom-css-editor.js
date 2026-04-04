import { TextareaControl } from '@wordpress/components';

export default function CustomCSSEditor( { label, value, onChange } ) {
    return (
        <TextareaControl
            label={ label }
            value={ value }
            onChange={ onChange }
            placeholder={ '.apg-google-reviews { ... }' }
            rows={ 10 }
            style={ {
                fontFamily: 'monospace',
                fontSize: '12px',
                whiteSpace: 'pre',
                overflowX: 'auto',
            } }
        />
    );
}
