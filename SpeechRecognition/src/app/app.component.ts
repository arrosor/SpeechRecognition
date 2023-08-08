import { ChangeDetectorRef, Component } from '@angular/core';
import { IRecognitionResult } from '../recognition-result.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SpeechRecognition';
  continuousChecked: boolean = false;
  isStarted: boolean = false;
  isAutoRestart: boolean = false;
  resultList: IRecognitionResult[] = [];

  recognition: SpeechRecognition;

  log: string[] = [];

  constructor(private ref: ChangeDetectorRef) {

    var speechRecognition  = window.SpeechRecognition || window.webkitSpeechRecognition;

    this.recognition = new speechRecognition();

    this.recognition.lang = 'en-US';

    this.recognition.onresult = (ev: SpeechRecognitionEvent) => {

      for (var i = 0; i < ev.results.length; i++) {
        this.resultList = [];
        this.resultList[i] = {
          alternativs: [],
          result: ev.results[i]
        }
        for (var j = 0; j < ev.results[i].length; j++) {
          this.resultList[i].alternativs[j] = ev.results[i][j];
        }
      }
      this.addLine('results: ' + ev.results.length);
      this.addLine('results: ' + ev.results[0][0].transcript);
    }

    this.recognition.onnomatch = (event) => this.addLine("I didn't recognize that.");
    this.recognition.onerror = (event) => this.addLine("Error: " + event.error);

    this.recognition.onend = () => {
      this.isStarted = false;
      this.addLine('End');
      if (this.isAutoRestart) {
        this.isStarted = true;
        this.recognition.start();
      }
    };

    this.recognition.onaudiostart = () => this.addLine('Audio started');
    this.recognition.onaudioend = () => this.addLine('Audio end');
    this.recognition.onspeechstart = () => this.addLine('Speech start');
    this.recognition.onspeechend = () => this.addLine('Speech end');
    this.recognition.onsoundstart = () => this.addLine('Sound start');
    this.recognition.onsoundend = () => this.addLine('Sound end');
  }

  ngOnInit() {

  }


  startRecornition() {
    if (this.isStarted) {
      this.recognition.stop();
    }
    else {
      this.recognition.start();
    }
    this.isStarted = !this.isStarted;
  }

  addLine(str: string) {
    var date = new Date();
    var time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()+' ';
    console.log(time + str);
    this.log.unshift(time + str);
    this.ref.markForCheck();
    this.ref.detectChanges();
  }

}
