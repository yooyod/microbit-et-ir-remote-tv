
/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org/blocks/custom
 */



 //--------- Enum valiable----------------------   

// IR blocks supporting a ET-IR RemoteTV Key  

const enum IrTvButtonAction 
{
  //% block="pressed"
  Pressed = 0,
  //% block="released"
  Released = 1,
}

const enum IrTvButton 
{
    //% block="⛔️"
      Power = 2 ,    

    //% block=" "
      Any = -1,

    //% block=" "
      Any1 = -1,

    //% block="⊝"
      Pwr = 170 , 
   //=================== 

    //% block=" "
      Any2 = -1 ,

    //% block="⬛️TV IN"
      TVin = 26 ,
      
    //% block="⬛️VOL-"
      VolSub = 234,

    //% block="⬛️VOL+"
      VolAdd = 106,
 //=================== 

    //% block="🟥SETUP"
      Setup = 194 ,

    //% block="🟩APP"
      App = 240 ,
      
    //% block="🟨VOL-"
      VLsub = 8,

    //% block="🟦VOL+"
      VLadd = 24,

//=================== 

    //% block=" "
      Any3= -1,

    //% block="🏠"
      Home = 136 ,

    //% block="🔼"
      Up = 104 ,
      
    //% block="↶"
      Back = 152,
//======================

    //% block=" "
      Any4= -1,

    //% block="◀️"
      Left = 138,

    //% block="🆗"
      Midd = 200,

    //% block="▶️"
      Right = 10,

//=======================  

    //% block=" "
      Any5 = -1,

    //% block="📄"
      List = 50,

    //% block="🔽"
      Down  = 88,

    //% block="🖱"
      Mouse = 0,
//=========================

   //% block=" "
      Any6 = -1,

    //% block="1"
      Num1 = 114,

    //% block="2"
      Num2  = 176,

    //% block="3"
      Num3 = 48,
//=========================

   //% block=" "
      Any7 = -1,

    //% block="4"
      Num4 = 82,

    //% block="5"
      Num5  = 144,

    //% block="6"
      Num6 = 16,
//=========================


   //% block=" "
      Any8 = -1,

    //% block="7"
      Num7 = 98,

    //% block="8"
      Num8  = 160,

    //% block="9"
      Num9 = 32,
//=========================


   //% block=" "
      Any9 = -1,

    //% block="🔇"
      Mult = 130,

    //% block="0"
      Num0  = 128,

    //% block="⌫"
      Del = 66,
//=========================

}


const enum IrTvProtocol 
{
  //% block="Keyestudio"
  Keyestudio = 0,
  //% block="NEC"
  NEC = 1,
}

/**++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   ++                            Custom blocks                     ++
   ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

//% weight=125 color="#E11584" icon="\uf09e"    

namespace IR_RemoteTV 
{
  let irState: IrState;

  const MICROBIT_MAKERBIT_IR_NEC = 777;
  const MICROBIT_MAKERBIT_IR_DATAGRAM = 778;
  const MICROBIT_MAKERBIT_IR_BUTTON_PRESSED_ID = 789;
  const MICROBIT_MAKERBIT_IR_BUTTON_RELEASED_ID = 790;
  const IR_REPEAT = 256;
  const IR_INCOMPLETE = 257;
  const IR_DATAGRAM = 258;

  interface IrState {protocol: IrTvProtocol; hasNewDatagram: boolean; bitsReceived: uint8; addressSectionBits: uint16;
                    commandSectionBits: uint16;hiword: uint16;loword: uint16;}


/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 ++                                Sub CustomBox                                   ++
 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

/*+++++++++++++++++++++++++++++++++++++++++++++++++++++ 
 +  Function:Appemd bit To Datagram.                  +       
 +  Input: bit = Decimal Number 0-9  ไม่เกิน 8 หลัก      +        
 ++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

    function appendBitToDatagram(bit: number): number 
    {
        irState.bitsReceived += 1;

        if (irState.bitsReceived <= 8) 
        {
            irState.hiword = (irState.hiword << 1) + bit;

            if(irState.protocol === IrTvProtocol.Keyestudio && bit === 1) 
            {
            // recover from missing message bits at the beginning
            // Keyestudio address is 0 and thus missing bits can be detected
            // by checking for the first inverse address bit (which is a 1)
                irState.bitsReceived = 9;
                irState.hiword = 1;
            }
        } 
        else if (irState.bitsReceived <= 16) 
        {
            irState.hiword = (irState.hiword << 1) + bit;

        } 
        else if (irState.bitsReceived <= 32) 
        {
            irState.loword = (irState.loword << 1) + bit;
        }

        if (irState.bitsReceived === 32) 
        {                                            
            irState.addressSectionBits = irState.hiword & 0xffff;
            irState.commandSectionBits = irState.loword & 0xffff;
        
            return IR_DATAGRAM;
        } 
        else 
        {
            return IR_INCOMPLETE;
        }

    } //End Function appen


/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++                                                                     ++
  ++                              Function:Decode                        ++
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ++                                                                     ++
  ++       Input :                                                       ++
  ++                  markAndSpace =                                     ++
  ++                                                                     ++
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

    function decode(markAndSpace: number): number 
    {
        if(markAndSpace < 1600)          // low bit
        {   
             return appendBitToDatagram(0);
        } 
        else if (markAndSpace < 2700)    // high bit
        {
            return appendBitToDatagram(1);
        }

        irState.bitsReceived = 0;

        if(markAndSpace < 12500)    // Repeat detected
        {
            return IR_REPEAT;
        } 
        else if (markAndSpace < 14500) 
        {
            // Start detected
            return IR_INCOMPLETE;
        } 
        else 
        {
            return IR_INCOMPLETE;
        }

    } //End Function Decode




function enableIrMarkSpaceDetection(pin: DigitalPin) 
    {
    pins.setPull(pin, PinPullMode.PullNone);

    let mark = 0;
    let space = 0;

    pins.onPulsed(pin, PulseValue.Low, () => {
      // HIGH, see https://github.com/microsoft/pxt-microbit/issues/1416
                                                 
      mark = pins.pulseDuration();
    });

    pins.onPulsed(pin, PulseValue.High, () => {
      // LOW
                                      
      space = pins.pulseDuration();
      const status = decode(mark + space);

      if (status !== IR_INCOMPLETE) {
        control.raiseEvent(MICROBIT_MAKERBIT_IR_NEC, status);
      }

    });
  }


  /**
   * Connects to the IR receiver module at the specified pin and configures the IR protocol.
   * @param pin IR receiver pin, eg: DigitalPin.P0
   * @param protocol IR protocol, eg: IrProtocol.Keyestudio
   */

  // subcategory="IR Receiver"
  //% blockId="makerbit_infrared_connect_receiver"
  // block="connect IR receiver at pin %pin and decode %protocol"   
  //% block="connect IRtv receiver at pin %pin"
  //% pin.fieldEditor="gridpicker"
  //% pin.fieldOptions.columns=4
  //% pin.fieldOptions.tooltips="false"
  //% weight=90
  //export function connectIrReceiver( pin: DigitalPin,protocol: IrProtocol):void   @@@@@@
   export function connectIrReceiver( pin: DigitalPin):void 
   {
    if (irState) 
    {
      return;
    }

    irState = {
      //protocol: protocol,  @@@@@@@
      protocol : 1 ,
      bitsReceived: 0,
      hasNewDatagram: false,
      addressSectionBits: 0,
      commandSectionBits: 0,
      hiword: 0, // TODO replace with uint32
      loword: 0,
    };

                                               

    enableIrMarkSpaceDetection(pin);
   

    let activeCommand = -1;
    let repeatTimeout = 0;
    const REPEAT_TIMEOUT_MS = 120;

    control.onEvent(
      MICROBIT_MAKERBIT_IR_NEC,
      EventBusValue.MICROBIT_EVT_ANY,
      () => {
        const irEvent = control.eventValue();

        // Refresh repeat timer
        if (irEvent === IR_DATAGRAM || irEvent === IR_REPEAT) {
          repeatTimeout = input.runningTime() + REPEAT_TIMEOUT_MS;
        }

        if (irEvent === IR_DATAGRAM) {
          irState.hasNewDatagram = true;
          control.raiseEvent(MICROBIT_MAKERBIT_IR_DATAGRAM, 0);

          const newCommand = irState.commandSectionBits >> 8;

          // Process a new command
          if (newCommand !== activeCommand) {
            if (activeCommand >= 0) {
              control.raiseEvent(
                MICROBIT_MAKERBIT_IR_BUTTON_RELEASED_ID,
                activeCommand
              );
            }

            activeCommand = newCommand;
            control.raiseEvent(
              MICROBIT_MAKERBIT_IR_BUTTON_PRESSED_ID,
              newCommand
            );
          }
        }
      }
    );

    control.inBackground(() => {
      while (true) {
        if (activeCommand === -1) {
          // sleep to save CPU cylces
          basic.pause(2 * REPEAT_TIMEOUT_MS);
        } else {
          const now = input.runningTime();
          if (now > repeatTimeout) {
            // repeat timed out
            control.raiseEvent(
              MICROBIT_MAKERBIT_IR_BUTTON_RELEASED_ID,
              activeCommand
            );
            activeCommand = -1;
          } else {
            basic.pause(REPEAT_TIMEOUT_MS);
          }
        }
      }
    });
  }

  /**
   * Do something when a specific button is pressed or released on the remote control.
   * @param button the button to be checked
   * @param action the trigger action
   * @param handler body code to run when the event is raised
   */
  // subcategory="IR Receiver"
  //% blockId=makerbit_infrared_on_ir_button
  //% block="on IRtv button | %button | %action"
  //% button.fieldEditor="gridpicker"
  //% button.fieldOptions.columns=4
  //% button.fieldOptions.tooltips="false"

  //% weight=50
  export function onIrButton(
    button: IrTvButton,
    action: IrTvButtonAction,
    handler: () => void
  ) {
    control.onEvent(
        action === IrTvButtonAction.Pressed
        ? MICROBIT_MAKERBIT_IR_BUTTON_PRESSED_ID
        : MICROBIT_MAKERBIT_IR_BUTTON_RELEASED_ID,

      button === IrTvButton.Any ? EventBusValue.MICROBIT_EVT_ANY : button,
      () => {
        handler();
      }
    );
  }

  /**
   * Returns the code of the IR button that was pressed last. Returns -1 (IrButton.Any) if no button has been pressed yet.
   */
  // subcategory="IR Receiver"
  //% blockId=makerbit_infrared_ir_button_pressed
  //% block="IRtv button"
  //% weight=70
  export function irButton(): number {
    if (!irState) {
      return IrTvButton.Any;
    }
    return irState.commandSectionBits >> 8;
  }

  /**
   * Do something when an IR datagram is received.
   * @param handler body code to run when the event is raised
   */
  // subcategory="IR Receiver"
  //% blockId=makerbit_infrared_on_ir_datagram
  //% block="on IRtv datagram received"
  //% weight=40
  export function onIrDatagram(handler: () => void) {
    control.onEvent(
      778 ,//MICROBIT_MAKERBIT_IR_DATAGRAM,
      EventBusValue.MICROBIT_EVT_ANY,
      () => {
        handler();
      }
    );
  }    

  
  /**
   * Returns the IR datagram as 32-bit hexadecimal string.
   * The last received datagram is returned or "0x00000000" if no data has been received yet.
   */
  // subcategory="IR Receiver"
  //% blockId=makerbit_infrared_ir_datagram
  //% block="IRtv datagram"
  //% weight=30
  export function irDatagram(): string {  
    if (!irState) {
      return "0x00000000";
    }
    return (
      "0x" +
      ir_rec_to16BitHex(irState.addressSectionBits) +
      ir_rec_to16BitHex(irState.commandSectionBits)
    );
  }

  /**
   * Returns true if any IR data was received since the last call of this function. False otherwise.
   */
  // subcategory="IR Receiver"
  //% blockId=makerbit_infrared_was_any_ir_datagram_received
  //% block="IRtv data was received"
  //% weight=80
  export function wasIrDataReceived(): boolean {
    if (!irState) {
      return false;
    }
    if (irState.hasNewDatagram) {
      irState.hasNewDatagram = false;
      return true;
    } else {
      return false;
    }
  }

  /**
   * Returns the command code of a specific IR button.
   * @param button the button
   */
  // subcategory="IR Receiver"
  //% blockId=makerbit_infrared_button_code
  //% button.fieldEditor="gridpicker"
  //% button.fieldOptions.columns=4
  //% button.fieldOptions.tooltips="false"
  //% block="IRtv button code %button"
  //% weight=60
  export function irButtonCode(button: IrTvButton): number {
    return button as number;
  }


  function ir_rec_to16BitHex(value: number): string {
    let hex = "";
    for (let pos = 0; pos < 4; pos++) {
      let remainder = value % 16;
      if (remainder < 10) {
        hex = remainder.toString() + hex;
      } else {
        hex = String.fromCharCode(55 + remainder) + hex;
      }
      value = Math.idiv(value, 16);
    }
    return hex;
  }


} /*End Custom Block*/