IR_RemoteTV.onIrDatagram(function () {
    basic.showNumber(IR_RemoteTV.irButton())
})
IR_RemoteTV.connectIrReceiver(DigitalPin.P11)
