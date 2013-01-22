this._editor = {};

$( document ).ready( function() {
    var dh = $( window ).height(),
        ch = dh - 10;
    $( ".container" ).height( ch );
    $( "#viewer-frame" ).height( ch );
    
    var eh = $( "#editor-menu" ).height();
    
    $( "#editor-menu > li" ).each( function( i, e ) {
        if( i > 0 ) {
            $( e ).click( function( el ) {
                var tgr = el.target,
                    txt = $( tgr ).html().toLowerCase();
                    
                $( tgr ).parent().children( "li" ).removeClass( "selected" );
                $( tgr ).addClass( "selected" );
                
                $( ".panel" ).css( "display", "none" );
                $( "#panel-" + txt ).css( "display", "block" );
                var eidid = $( tgr ).attr( "data-editor" );
                _editor[ eidid ].focus();
            } );
        }
    } );

    $( "textarea" ).each( function( i, e ) {
        $( e ).val("");
        var mime = $( e ).attr( "data-mode" ),
            editor = CodeMirror.fromTextArea( e, {mode: "text/" + mime, lineNumbers:true} ),
            eidid = String( $( e ).attr( "id" ) ).replace( "edit-", "" );
            _editor[ eidid ] = editor;
            if( typeof localStorage !== "undefined" && typeof localStorage[ eidid ] !== "undefined" )
                editor.setValue( localStorage[ eidid ] );
    } );
    
    $( ".CodeMirror" ).height( ch - eh );
    $( "#editor-menu > li:nth-child(2)" ).click();
    
    $( window ).keydown( function( e ) {
        var keyCode = String.fromCharCode( e.which ).toLowerCase();
        if( e.ctrlKey ) {
            if( keyCode == "s" ) {
                e.preventDefault();
                viewIt();
                return false;
                
            }else if( e.shiftKey && ( e.which == 34 || e.which == 33 ) ){
                var index = 1, max = 0;
                $( "#editor-menu > li" ).each( function( i, e ) {
                    if( $( e ).hasClass( "selected" ) )
                        index = i;
                    max = i;
                } );
                if( e.which == 33 )
                    index--;
                else
                    index++;
                
                if( index == 0 )
                    index = max;
                else if ( index > max )
                    index = 1;
                $( "#editor-menu > li:nth-child(" + ( index+1 ) + ")" ).click();
            }
        }
    } );
} );

function viewIt() {
    var tx = "<!DOCTYPE html><html><meta charset='utf-8' /><title>JsTester</title>"
        + _editor.header.getValue()
        + "<style>"
        + _editor.css.getValue()
        + "</style>"
        + "<script type='text/javascript'>"
        + _editor.javascript.getValue()
        + "</script>"
        + "</head><body>"
        + _editor.html.getValue()
        + "</body></html>";
    
    var ifrm = document.getElementById( "viewer-frame" );
    ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
    ifrm.document.open();
    ifrm.document.write( tx );
    ifrm.document.close();
    
    if( typeof localStorage !== "undefined" ) {
        for( var k in _editor )
            localStorage[k] = _editor[k].getValue();
    }
}