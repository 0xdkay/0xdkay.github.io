---
layout: post
title: "(De)Soldering Tools"
date: 2014-08-01 12:21:48 +0900
comments: false
categories:
  - Embedded
---

There exist many tools used for soldering/desoldering. I would like to introduce those tools today.

<!-- more -->

## <a id="solder_iron"></a> Soldering Iron

{% img right http://www.rcsoup.com/wp-content/uploads/2012/09/soldering_iron.jpg 350 350%}

**Soldering Iron** is a tool used when you melt lead. For soldering and desoldering, soldering iron is basic tool which you will always use.

When you use soldering iron, you need to consider the temperature. If the temperature is too high, then you can easily melt lead and solder the components. However, because of the high temperature, other chips nearby could be damaged. Also, you need to take which tip you will use into account because the shape of tips is critical to heat conductivity. Therefore, you need to **choose right temperature, and right tips** for your target chip.

{% img center http://www.howardelectronics.com/xytronic/Images/TipsLF.jpg %}

There are several opinions related to the temperature of soldering iron, and most people recomment 315°C. You can see the discussion at the following link.

* [`What’s the proper soldering iron temperature for standard .031" 60/40 solder?`](http://electronics.stackexchange.com/questions/1980/what-s-the-proper-soldering-iron-temperature-for-standard-031-60-40-solder)

Also, there is a post which makes your own tips for soldering iron using copper wire. You can see this at the following link.

[{% img center http://cdn.instructables.com/F8G/X19D/FROA0ONL/F8GX19DFROA0ONL.MEDIUM.jpg 400 400 %}](http://www.instructables.com/id/Making-a-fine-tip-for-your-solding-iron-for-SMD-so/)


* [`Making a fine tip for your solding iron for SMD soldering`](http://www.instructables.com/id/Making-a-fine-tip-for-your-solding-iron-for-SMD-so/)

If the melted lead remains on the tip of soldering iron, it is really annoying when you solder a chip. Therefore, you need to clean the tips, and here is the tool, **Tip Cleaner**

{% img center http://www.hakko.com/english/images/products/products_hakko_599b_img.jpg 400 400 %}

## <a id="heat_gun"></a> Heat Gun

{% img right http://i00.i.aliimg.com/img/pb/066/598/476/476598066_254.jpg 350 350 %}

**Heat Gun** is a tool which blows hot air (similar temperature as soldring iron). While soldering iron melt lead on the surface touched by the tip, heat gun metls all lead at once. Therefore, it's really easy to desolder a chip using heat gun. However, there is disadvantage that because it melts all lead, **other chips also can be detached from the board which is not intended**. Also, the chips might be **more damaged** than soldering iron. Therefore, if you want to desolder a chip, then you need to consider carefully to choose the right tool between soldering iron and heat gun.

## <a id="flux_helper"></a> Flux Pen & Solder Paste

{% img left http://upload.wikimedia.org/wikipedia/commons/3/37/Flux_Pen.jpg 350 350 %}

**Flux Pen** is a tool that when you want to solder a chip. These pens are usually made of rosin, which is based on real 'rosin'. Rosin has good flux properties, a mixture of organic acids (resin acids, predominantly abietic acid, with pimaric acid, isopimaric acid, neoabietic acid, dihydroabietic acid, and dehydroabietic acid). Rosin is a glassy solid, virtually nonreactive and noncorrosive at normal temperature, but liquid, ionic and mildly reactive to metal oxides at molten state. Rosin tends to soften between 60-70 °C and is fully fluid at around 120 °C; molten rosin is weakly acidic and is able to dissolve thinner layers of surface oxides from copper without further additives. Therefore, If you just paint this pen at the target part and it's over, easy to solder. However, you need to **clean up the leftover** after you finished soldering because it could damage the circuit (short-circuit failure)

{% img right http://upload.wikimedia.org/wikipedia/commons/8/8f/Manufacturing_paste.jpg 350 350 %}

**Solder Paste** is used to connect the leads of surface mount integrated chip packages to attachment points in the circuit patterns on a printed circuit board as flux pen. Different from flux pen, solder paste include lead itself as a component. Therefore, you can do **lead-free soldering**. 

You can choose what to use between flux pen and solder paste as you prefer.

## <a id="cleaner"></a> Desoldering braid & Desolder Pump

**Desoldering braid**, also known as **desoldering wick** or **solder wick**, is finely braided 18 to 42 AWG copper wire coated with rosin flux, usually supplied on a roll. You can absorb melted lead using this.

{% img left http://upload.wikimedia.org/wikipedia/commons/b/b0/Solder_wick_rolled.jpg 350 350 %}
{% img right http://upload.wikimedia.org/wikipedia/commons/0/07/Solder_wick-close_up-part_PNr%C2%B00104.jpg 400 200 this_is_title_ test %}
{% img right http://upload.wikimedia.org/wikipedia/commons/3/36/Solder_wick-close_up-solder_impurities_PNr%C2%B00112.jpg 400 200 %}

{% img center http://upload.wikimedia.org/wikipedia/commons/b/b9/Solder_sucker.jpg test %}






