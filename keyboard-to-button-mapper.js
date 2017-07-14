(function () {
    'use strict';

    // keycode list https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode

    var main = function () {
        var buttons = Array.prototype.slice.call(document.querySelectorAll('jqx-toggle-button[data-button-mapper-keycode]'));

        var keyCodesMap = buttons.reduce(function(obj, button) {
            var keyCode = parseFloat(button.getAttribute('data-button-mapper-keycode'));

            if (typeof keyCode !== 'number' || isNaN(keyCode)) {
                console.error('Invalid keycode', keyCode, 'for button', button);
                return obj;
            }

            if (obj[keyCode] === undefined) {
                obj[keyCode] = [];
            }

            var keyCodeConfig = {
                button: button,
                down: false
            };
            obj[keyCode].push(keyCodeConfig);

            return obj;
        }, {});

        if (Object.keys(keyCodesMap).length === 0) {
            console.info('No buttons registered to the keyboard');
            return;
        }

        var downEvent = new PointerEvent('pointerdown', {
            bubbles: true,
            cancelable: true,
            pointerType: 'mouse'
        });

        var upEvent = new PointerEvent('pointerup', {
            bubbles: true,
            cancelable: true,
            pointerType: 'mouse'
        });

        document.addEventListener('keydown', function (evt) {
            var keyCodeConfigs = keyCodesMap[evt.keyCode];
            if (keyCodeConfigs === undefined) {
                return;
            }

            keyCodeConfigs.forEach(function (keyCodeConfig) {
                if (keyCodeConfig.down) {
                    return;
                }
                keyCodeConfig.down = true;
                keyCodeConfig.button.firstElementChild.dispatchEvent(downEvent);
            });
        });

        document.addEventListener('keyup', function (evt) {
            var keyCodeConfigs = keyCodesMap[evt.keyCode];
            if (keyCodeConfigs === undefined) {
                return;
            }

            keyCodeConfigs.forEach(function (keyCodeConfig) {
                keyCodeConfig.down = false;
                keyCodeConfig.button.firstElementChild.dispatchEvent(upEvent);
            });
        });
    };

    var domReady = function (readyCallback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', readyCallback);
        } else {
            readyCallback();
        }
    };

    domReady(main);
}());