VueExtendedInput Plugin
-
VueExtendedInput is a plugin designed to support keyboard, gamepads, touchscreen or a mouse. The approach of VueExtendedInput is like a game console UI, navigating elements using only up/down/left/right/back/select/home.

Goals for VueExtendedInput are:

* Turn typical html elements such as a, button, ul/ol li, or custom-class elements into UI components that can be navigated
* using the keyboard, gamepads, touchscreen or a mouse
* Account for other input methods and adjust interface as necessary (such as hiding the mouse cursor when another user input is detected)
* Account for a lack of keyboard, providing an Onscreen Keyboard as necessary
* Support simple themes for ui elements, with optional features like custom cursors

Usage
-
```js
import Vue from 'vue'
import ExtendedInput from 'VueExtendedInput'
Vue.use(ExtendedInput)
```
In your main App, init extended input. Config allows you to provide functions to handle select, back or home events:
```js
this.$extendedInput.init({
    home: function () {
        router.replace('/')
    }
})
```

In your Vue components mounted method, you may want to select a default element:
```js
this.$extendedInput.selectEl()
```