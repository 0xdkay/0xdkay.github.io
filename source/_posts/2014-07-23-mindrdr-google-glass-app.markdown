---
layout: post
title: "MindRDR - Google Glass App Control with Your Thoughts"
date: 2014-07-23 14:33:32 -0700
comments: false
categories:
  - Brain
---
A few weeks ago, there was a news from [TechCrunch](http://techcrunch.com/2014/07/09/forget-ok-glass-mindrdr-is-a-new-google-glass-app-that-you-control-with-your-thoughts/) announcing [`MindRDR`](http://www.thisplace.com/works/mindrdr), which is a Google Glass app that makes you control activites with your thoughts.

{% img center /images/2014/07/23/tc.png %}

## <a id="mindrdr"></a>What is MindRDR?
MindRDR is a Google Glass application which makes you take photos and share them on Twitter and Facebook with your `brain wave`. When you concentrate, it triggers to take photo and then you can share it again concentrating.

<div style="text-align: center">
<iframe src="http://player.vimeo.com/video/99915694" width="500" height="281" frameborder="0" allowfullscreen></iframe>
</div>

At first time, I thought that there was a new version of Google Glass has come out, but in fact, it is **just a combination** of *Google Glass* and [*Mindwave*](http://store.neurosky.com/products/mindwave-1) from [NeuroSky](http://neurosky.com/). This means that you need to buy additional device even you already have Google Glass! I would guess not many people would do that.

{% img center /images/2014/07/23/glass_and_wave.png 500 500 %}

## <a id="neurosky"></a>NeuroSky?

[*NeuroSky*](http://neurosky.com/) is a company selling EEG & ECG based devices. They are at the forefront of biosensor innovation, and research new technologies related to our brain.

> NeuroSky is breaking the boundaries of body and mind monitoring and analysis for consumer-facing, wearable technology products. Our innovative biosensors are used in hundreds of products, brought to market by our partners, for body and mind health. These solutions capture, quantify and reveal unique health and wellness insights and give millions of people the ability to monitor and improve the performance body and mind.

USC, Yale, Stanford, UCLA, MIT, and The University of Wollongong have adopted NeuroSky's EEG biosensor solutions for their work. There exist many apps using these devices in the NeuroSky Store, and you can use it.

{% img right http://tahaogulcanyavuz.com/images/emotiv1.jpg 300 300 %}
[*Emotiv*](http://emotiv.com/) is another company. One of their famous product is [**EPOC**]() which has 14 electrodes to receive EEG signals. You can use this devices to measure EEG signals from positions: *AF3, F7, F3, FC5, T7, P7, O1, O2, P8, T8, FC6, F4, F8, AF4*

I used Emotiv EPOC last semester for my term project in *Introduction to Brain IT*  held by [Dae-Shik Kim](http://brain.kaist.ac.kr/people_professor.html). I would post it later.

## <a id="eeg_ecg"></a>EEG & ECG?

{% img left http://upload.wikimedia.org/wikipedia/commons/b/bf/EEG_cap.jpg 200 200 %}
[*EEG*](http://en.wikipedia.org/wiki/Electroencephalography), *Electroencephalography*, is the recording of electrical activity along the scalp. EEG measures voltage fluctuations resulting from ionic current flows within the neurons of the brain. In clinical contexts, EEG refers to the recording of the brain's spontaneous electrical activity over a short period of time, usually 20–40 minutes, as recorded from multiple electrodes placed on the scalp. Diagnostic applications generally focus on the spectral content of EEG, that is, the type of neural oscillations that can be observed in EEG signals.
There are previous researches related to P300, which is a kind of *Event Related Potential (ERP)*, a EEG signal which can be shown 300ms after a stimuli is given.

{% img right http://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/ECGcolor.svg/345px-ECGcolor.svg.png 200 200 %}
[*ECG*](http://en.wikipedia.org/wiki/Electrocardiography), *Electrocardiography*, also known as *EKG*, is the recording of the electrical activity of the heart. Traditionally this is in the form of a transthoracic (across the thorax or chest) interpretation of the electrical activity of the heart over a period of time, as detected by electrodes attached to the surface of the skin and recorded or displayed by a device external to the body. The recording produced by this noninvasive procedure is termed an electrocardiogram (also ECG or EKG). It is possible to record ECGs invasively using an implantable loop recorder.

There are also other kinds: *EOG*, *EMG*, and so on. Both EEG and ECG can be used as a reference when police forces a confession from a suspect. Don't lie :)

## <a id="analysis"></a>MindRDR Source Code Analysis

MindRDR is an open source project, so we can access it via [Github](https://github.com/ThisPlace/MindRDR). The code was really simple. They set some *TRIGGER_VALUE* which distinguish each state of the user. Starting from *MIND_TAKING_PHOTO* state, it changes to *MIND_SHARING*, and so on. The trigger value is given by the author in specific value. *Mindwave* also provides the state of device, so the authors if *MindRDR* also used this feature in their code.

``` java MindRdrActivity.java
package com.thisplace.mindrdr;

/* ... */

public class MindRdrActivity extends Activity {
  public final static String DEBUG_TAG = "MindCameraActivity";

  /* ... */

  private static final int INTENSITY_TRIGGER = 80;
  private static final int LINE_VALUE_MULTIPLIER = LINE_RANGE / INTENSITY_TRIGGER;
  private static final int INTENSITY_CANCEL_TRIGGER = 10;
  private static final int MIND_TAKING_PHOTO = 0;
  private static final int MIND_SHARING = 1;
  private static final int MIND_DISABLED = 2;
  private static final int MIND_INITIALISING = 3;

  /* ... */

  case TGDevice.STATE_IDLE:
    break;
  case TGDevice.STATE_CONNECTING:
    break;

  /* ... */
```
Using state information, *MindRDR* decides what to do as below.

``` java MindRdrActivity.java start:123
  if (mMindControlState != MIND_DISABLED) {
    mMindSession.updateMindData();

    int value = LINE_RANGE
      - Math.min(LINE_RANGE, Math.round(mMindSession.getAttention() * LINE_VALUE_MULTIPLIER));
    mLine.setTranslationY(LINE_START_Y + value);

    if (mMindSession.getAttention() >= INTENSITY_TRIGGER) {
      if (mMindControlState == MIND_TAKING_PHOTO) {
        mMindControlState = MIND_DISABLED;
        takePhoto();

      } else if (mMindControlState == MIND_SHARING) {
        mMindControlState = MIND_DISABLED;
        if (tgDevice != null) {
          tgDevice.close();
        }
        upload();
      }
    } else if (mMindSession.getAttention() <= INTENSITY_CANCEL_TRIGGER && mMindControlState == MIND_SHARING) {
      mCancelText.setVisibility(View.INVISIBLE);
      mSendText.setVisibility(View.INVISIBLE);

      initializeCamera();
      showTakePhotoView();
    }

  }
```

Simple, simple, simple. I don't know whether it works for everyone because EEG signal strength is different among people, and even different by environment.

## <a id="lesson"></a>Lessons Learned
> If you have an idea, think it twice, try faster.

