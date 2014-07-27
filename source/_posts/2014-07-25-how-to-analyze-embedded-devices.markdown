---
layout: post
title: "How to Analyze Embedded Devices?"
date: 2014-07-25 13:35:59 -0700
comments: false
categories:
  - Embedded
---
Yesterday there was a post in the [*XDA Developers*](http://www.xda-developers.com/android/samsung-gear-live-stock-firmware-image-pulled-temp-root/) saying that [AdamOutler](http://plus.adamoutler.com/) again pulled out [*Samsung Gear*](http://www.samsung.com/global/microsite/gear/gearlive_design.html) live firmware image. He distributed custom kernel image and pulled images.

{% img center /images/2014/07/25/gear.png %}

Reading this article, I would like to sum-up the method to extract firmwares from embedded devices. So lets start.

<!-- more -->

## <a id="serial"></a> Serial Communication

Before start, we need to know about the *Serial Communication*. There are many kinds of serial communication, and we will look through some famous and popular methods. Nowadays, many people are confused about the definition of serial communication. However, it's really easy as it is written.

> **Serial communication** is the process of sending data one bit at a time

As you can find that on the [wikipedia](http://en.wikipedia.org/wiki/Serial_communication), we covers all the protocols that you might think. People usually think UART is the same as serial communication but it isn't. UART is just a kind of serial communication. Now have a look on different kinds.
Finding which interface is used by the device is quite tedious, that means you need to try all the methods using [**Logic Analyzer**](http://en.wikipedia.org/wiki/Logic_analyzer) or other connectors for each protocol.

## <a id="uart"></a> UART

{% img right /images/2014/07/25/uart.JPG 250 250 %}

**UART**, a short form of *Universal Asynchronous Receiver/Transmitter*, is a piece of computer hardware that translates data between parallel and serial forms. UARTs are commonly used in conjunction with communication standards such as EIA, RS-232, RS-422 or RS-485. The universal designation indicates that the data format and transmission speeds are configurable. The electric signaling levels and methods (such as differential signaling etc.) are handled by a driver circuit external to the UART.

For the convenience of debugging the devices, embedded devices often have debug ports with UART. When you put RX/TX part of UART connector, then you can easily see the debugging messages through it. The device on the right is one kind of UART-to-USB connector from FTDI, and you can connect to it via Serial.
Just put this device and download the drivers from [*FTDI*](http://www.ftdichip.com/Products/ICs/FT232R.htm), then it's done! Below video is AdamOutler's finding UART interface in Samsung Gear. You can find UART interface as this video putting RX/TX pins to the device.


<div style="text-align: center">
<iframe width="560" height="315" src="//www.youtube.com/embed/xvY2Y21EYWo" frameborder="0" allowfullscreen></iframe>
</div>

## <a id="jtag"></a> JTAG

{% img right /images/2014/07/25/olimex.JPG 250 250 %}

**JTAG**, a short form of *Joint Test Action Group*, is the common name for the IEEE 1149.1 Standard Test Access Port and Boundary-Scan Architecture. It was initially devised by electronic engineers for testing printed circuit boards using boundary scan and is still widely used for this application. 

With JTAG interface, you can attach debuggers to it. For example, GDB can be attached to your JTAG. There are several researches related to firmware analysis to find malwares on embedded devices.

* [Avatar: A Framework to Support Dynamic Security Analysis of Embedded Systems’ Firmwares, Jonas Zaddach et al.](http://www.syssec-project.eu/m/page-media/3/ndss14_zaddach.pdf), utilized JTAG to perform symbolic execution with real-time environments.

The device on the right image is [*Olimex*](https://www.olimex.com/Products/ARM/JTAG/ARM-USB-OCD/). With this device, you can utilize OpenOCD which is a open source based JTAG implementation. You can follow instructions in this link for ARM Cortex M3. 

* [`http://www.downloads.seng.de/HowTo_ToolChain_STM32_Ubuntu.pdf`](http://www.downloads.seng.de/HowTo_ToolChain_STM32_Ubuntu.pdf)

As default, it uses 3333 port for GDB attachment, and 4444 port for telnet based debugging interface. To start, just type:

``` sh
$ /bin/openocd -f [module.cfg] -f [target.cfg]
    #module configuration files are in 'openOCD/share/openocd/scripts/interface'
    #target configuration files are in 'openOCD/share/openocd/scripts/target
```

To attach GDB,

``` sh
$ target remote localhost:3333
$ monitor halt                    # halts at current instruction, and shows registers
$ monitor resume                  # resumes the program
```

There exists two modes in JTAG, so you need to select proper one for your purpose.

1. ARM Debug Mode - usually to connect jtag as above.
2. Boundary Scan Cell Mode - to check the connectivity between chips

JTAG also can be chained as below, you should be careful when you follow TDI/TDO wires from the processor.

{% img center http://program-paralel-pk2.konsultan-pendidikan-tinggi.biz/_buku_manual/_baca_blob.php?book=lain&td=1&kodegb=654px-Jtag_chain.png %}

## <a id="swd"></a> SWD

{% img right /images/2014/07/25/jlink.JPG 350 350 %}

**SWD**, a short form of *Serial Wire Debug*, is a 2-pin electrical alternative JTAG interface that has the same JTAG protocol on top. It uses the existing GND connection. SWD uses an ARM CPU standard bi-directional wire protocol, defined in the ARM Debug Interface v5. This enables the debugger to become another AMBA bus master for access to system memory and peripheral or debug registers. Data rate is up to 4 Mbytes/sec at 50 MHz. SWD also has built-in error detection. On JTAG devices with SWD capability, the TMS and TCK are used as SWDIO and SWCLK signals, providing for dual-mode programmers.

Using [*Jlink*](http://www.segger.com/jlink-debug-probes.html) in the right picture, you can use both JTAG and SWD interface. Also, you can get pin alignment in the below link:

* [`http://www.segger.com/interface-description.html`](http://www.segger.com/interface-description.html)

## <a id="useful"></a> Some Useful Tools

{% img left /images/2014/07/25/logic.JPG 400 400 %}
{% img center /images/2014/07/25/jtagulator.JPG 400 400 %}

**Logic Analyzer** is a good device when you have to see the signals from the pins if you don't have any datasheet. Put all the electrodes on each pin and measure the signal. Starting from RST, you may find right debugging interface. (I failed :/) The device on the left picture is logic analyzer from Quantasylum, you can access to it via this link:

* [`Device Info`](http://www.quantasylum.com/content/Products/QA100.aspx)
* [`Drivers`](https://www.quantasylum.com/content/Support/Downloads.aspx#QA100)
* [`Documentation`](http://www.quantasylum.com/content/Portals/0/UploadedFiles/QA100%20Documentation.pdf)


The device on the right is [**JTAGulator**](http://www.grandideastudio.com/portfolio/jtagulator/). JTAGulator is a cool device that automatically detects UART & JTAG interface.  It's circuit is protected, so you don't have to worry about the over-voltage. There exists 24 channels which means that you can test 24 electrodes all at once. It connects to PC with Serial, so you can just press start button and wait having a cup of coffee.

## <a id="con"></a> Conclusion

There are many debugging interfaces supported by embedded devices. However, nowadays, embedded designers protect their these debugging features using password or other special input signals so-called 'Secure'. Therefore, from now, we need to consider how we can access to right debugging interface when they are protected.




