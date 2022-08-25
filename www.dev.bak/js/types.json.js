function types_json(require, module, exports) {
    module.exports = {
        "MouseEvent": [
            "click",
            "mousedown",
            "mouseup",
            "mouseover",
            "mousemove",
            "mouseout"
        ],
        "KeyBoardEvent": [
            "keydown",
            "keyup",
            "keypress"
        ],
        "MutationEvent": [
            "DOMSubtreeModified",
            "DOMNodeInserted",
            "DOMNodeRemoved",
            "DOMNodeRemovedFromDocument",
            "DOMNodeInsertedIntoDocument",
            "DOMAttrModified",
            "DOMCharacterDataModified"
        ],
        "HTMLEvent": [
            "load",
            "unload",
            "abort",
            "error",
            "select",
            "change",
            "submit",
            "reset",
            "focus",
            "blur",
            "resize",
            "scroll"
        ],
        "UIEvent": [
            "DOMFocusIn",
            "DOMFocusOut",
            "DOMActivate"
        ]
    }

}