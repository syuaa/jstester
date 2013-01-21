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
            } );
        }
    } );

    $( "textarea" ).each( function( i, e ) {
        $( e ).val("");
        var mime = $( e ).attr( "data-mode" ),
            editor = CodeMirror.fromTextArea( e, {mode: "text/" + mime, lineNumbers:true} ),
            eidid = String( $( e ).attr( "id" ) ).replace( "edit-", "" );
            _editor[ eidid ] = editor;
    } );
    
    $( ".CodeMirror" ).height( ch - eh );
    $( "#editor-menu > li:nth-child(2)" ).click();
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
}