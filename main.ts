let heartsensor_old = 0
let heartsensor = 0
let timestamps = [
0,
0,
0,
0,
0,
0,
0,
0,
0,
0
]
let delta = 0
let bpm = 0 
let k=0
let current_time=0
let foundbeat=false
serial.redirectToUSB()
basic.forever(function () {
    heartsensor = pins.analogReadPin(AnalogPin.C17)
    //serial.writeNumber(heartsensor)
    //serial.writeLine("")
    if ((!foundbeat) && (heartsensor_old<heartsensor) && (heartsensor > 530) && (heartsensor < 560)) {
        // if value stays above threshold it is still the same beat
        foundbeat=true
        current_time=input.runningTime()
        k=k+1
        // serial.writeNumber(heartsensor)
        // serial.writeLine("")
        basic.setLedColor(0xff0000)
        for (let Index = 0; Index < 9; Index++) {
            timestamps[Index]=timestamps[Index+1]
        }
        timestamps[9] = current_time
        if (k>10){
            // delta - time in ms for the last 10 beats
            delta = timestamps[9] - timestamps[0]
            // calculate time_min from time_ms
            // 1 min = 60 s = 60*1000 ms
            // 1 ms = 1/60/1000 min
            bpm = 9 / (delta/60/1000)
            // divide 9 by the delta, not 10 !
            //serial.writeValue("bpm",Math.round(bpm))
            basic.showNumber(Math.round(bpm),80)
            k=0
        }        
    } else {
        if (heartsensor<530) {
            // if value goes below threshold re-arm the trigger
            foundbeat=false
        }
        basic.setLedColor(0)
    }
    heartsensor_old=heartsensor
})
