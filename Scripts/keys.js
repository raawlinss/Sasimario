var keys = {
    bind: function() {
        $(document).on('keydown', function(event) {
            return keys.handler(event, true);
        });
        $(document).on('keyup', function(event) {
            return keys.handler(event, false);
        });
    },
    reset: function() {
        keys.left = false;
        keys.right = false;
        keys.accelerate = false;
        keys.up = false;
        keys.down = false;
    },
    unbind: function() {
        $(document).off('keydown');
        $(document).off('keyup');
    },
    handler: function(event, status) {
        switch (event.keyCode) {
            case 65: // A - left
                keys.left = status;
                break;
            case 68: // D - right
                keys.right = status;
                break;
            case 83: // S - down / crouch
                keys.down = status;
                break;
            case 32: // SPACEBAR - jump
                keys.up = status;
                break;
            default:
                return true;
        }

        event.preventDefault();
        return false;
    },
    accelerate: false,
    left: false,
    up: false,
    right: false,
    down: false,
};

// Now you can bind the keys using the following line:
keys.bind();
