# Extention IR Remote-TV Receive 

> Open this page at [https://yooyod.github.io/microbit-et-ir-remote-tv/](https://yooyod.github.io/microbit-et-ir-remote-tv/)



## Usage

```blocks
IR_RemoteTV.connectIrReceiver(DigitalPin.P11)
IR_RemoteTV.onIrButton(IrTvButton.Num1, IrTvButtonAction.Pressed, function () {
    basic.showString("BT1")
})

```


## Examples
### Receive Remote-TV Key and Show KeyCode Deciml at math On Display

```blocks
IR_RemoteTV.connectIrReceiver(DigitalPin.P11)
IR_RemoteTV.onIrDatagram(function () {
    basic.showNumber(IR_RemoteTV.irButton())
})

```

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [https://makecode.microbit.org/stable#](https://makecode.microbit.org/stable#)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/yooyod/microbit-et-ir-remote-tv** and import

## Edit this project ![Build status badge](https://github.com/yooyod/microbit-et-ir-remote-tv/workflows/MakeCode/badge.svg)

To edit this repository in MakeCode.

* open [https://makecode.microbit.org/stable#](https://makecode.microbit.org/stable#)
* click on **Import** then click on **Import URL**
* paste **https://github.com/yooyod/microbit-et-ir-remote-tv** and click import


#### Metadata (used for search, rendering)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
