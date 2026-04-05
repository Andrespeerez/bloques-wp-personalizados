import { useEffect, useRef } from '@wordpress/element';
import { EditorView, basicSetup } from 'codemirror';
import { css } from '@codemirror/lang-css';
import { EditorState } from '@codemirror/state';

export default function CustomCSSEditor( { value, onChange, label } ) {
    const editorRef = useRef( null );
    const viewRef = useRef( null );

    useEffect( () => {
        if ( ! editorRef.current ) return;

        const customTheme = EditorView.theme( {
            '&': {
                fontSize: '13px',
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                border: '1px solid #ddd',
                borderRadius: '4px',
            },
            '.cm-content': {
                padding: '12px',
                minHeight: '200px',
                caretColor: '#0066cc',
            },
            '.cm-focused': {
                outline: 'none',
                borderColor: '#0066cc',
            },
            '.cm-line': {
                padding: '0 4px',
            },
            '&.cm-focused .cm-cursor': {
                borderLeftColor: '#0066cc',
            },
            '.cm-selectionBackground, ::selection': {
                backgroundColor: '#b4d7ff !important',
            },
            '.cm-gutters': {
                backgroundColor: '#f5f5f5',
                borderRight: '1px solid #ddd',
                color: '#999',
            },
            '.cm-tooltip.cm-tooltip-autocomplete': {
                fontSize: '12px',
            },
        } );

        const state = EditorState.create( {
            doc: value || '',
            extensions: [
                basicSetup,
                css(),
                customTheme,
                EditorView.updateListener.of( ( update ) => {
                    if ( update.docChanged ) {
                        onChange( update.state.doc.toString() );
                    }
                } ),
                EditorView.lineWrapping,
            ],
        } );

        const view = new EditorView( {
            state,
            parent: editorRef.current,
        } );

        viewRef.current = view;

        return () => {
            view.destroy();
        };
    }, [] );

    useEffect( () => {
        if ( viewRef.current ) {
            const currentValue = viewRef.current.state.doc.toString();
            if ( currentValue !== value ) {
                viewRef.current.dispatch( {
                    changes: {
                        from: 0,
                        to: currentValue.length,
                        insert: value || '',
                    },
                } );
            }
        }
    }, [ value ] );

    return (
        <div className="apg-ricky-morty-custom-css-editor">
            { label && (
                <label
                    style={ {
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '500',
                        fontSize: '13px',
                    } }
                >
                    { label }
                </label>
            ) }
            <div
                ref={ editorRef }
                style={ {
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                    overflow: 'hidden',
                } }
            />
            <p
                style={ {
                    fontSize: '11px',
                    color: '#666',
                    marginTop: '8px',
                    lineHeight: '1.4',
                } }
            >
                Escribe propiedades CSS como <code style={ { background: '#f0f0f0', padding: '2px 4px', borderRadius: '2px' } }>color</code>,{' '}
                <code style={ { background: '#f0f0f0', padding: '2px 4px', borderRadius: '2px' } }>background</code>,{' '}
                <code style={ { background: '#f0f0f0', padding: '2px 4px', borderRadius: '2px' } }>margin</code>, etc.
                Usa el selector <code style={ { background: '#f0f0f0', padding: '2px 4px', borderRadius: '2px' } }>.apg-ricky-morty</code> para estilizar el bloque.
            </p>
        </div>
    );
}
