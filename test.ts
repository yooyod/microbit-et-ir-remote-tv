// tests go here; this will not be compiled when this package is used as an extension.

 
 IR_RemoteTV.onIrDatagram(function () 
 {
    basic.showNumber(IR_RemoteTV.irButton())
})
IR_RemoteTV.connectIrReceiver(DigitalPin.P11)



//© 2021 GitHub, Inc.