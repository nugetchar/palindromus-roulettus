import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, NgZone, OnInit } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {

  started!: boolean;
  ended!: boolean;
  generatingNewWord!: boolean;

  
  word!: string;
  score!: number;
  timeLeft!: number;
  
  private interval!: number;
  private initialTimeLeft!: number;

  private static readonly vowels = 'aeiouy'.split('');
  private static readonly consonnants = 'bcdfghjklmnpqrstvwxz'.split('');
  private static readonly decreaseInterval = 5;
  private static readonly MIN_WORD_LENTGH = 2;
  private static readonly MIN_TRAP_WORD_LENGTH = 4;

  constructor() { }

  ngOnInit(): void {
  }

  startGame() {
    this.ended = false;
    this.started = true;
    this.initialTimeLeft = 2000;
    this.score = 0;
    this.resetInterval();
    this.nextWord();
  }

  resetGame() {
    this.endGame();
    this.startGame();
  }

  checkAnswer(word: string, expectedPalindrom: boolean) {
    if (this.checkIsPalindrom(word) !== expectedPalindrom) {
      this.endGame();
    } else {
      this.incrementScore();
      this.nextWord();
      if (this.shouldDecreaseInitialTimeLeft(this.score)) {
        this.decreaseInitialTimeLeft();
      }
      this.resetInterval();
    }
  }

  get tweetTxt() {
    return `I scored ${this.score} on Palindromus Roulettus!`
  }

  private shouldDecreaseInitialTimeLeft(score: number) {
    return score % GameComponent.decreaseInterval === 0;
  }

  @HostListener('window:keyup', ['$event.key'])
  onKeyUp(key: string) {
    if (key === 'ArrowRight') {
      this.checkAnswer(this.word, true);
    } else if (key === 'ArrowLeft') {
      this.checkAnswer(this.word, false);
    }
  }

  private decreaseInitialTimeLeft() {
    if ((this.initialTimeLeft - 100) > 200) {
      this.initialTimeLeft -= 100;
    }
  }

  private incrementScore() {
    this.score++;
  }

  private startInterval() {
    this.timeLeft = this.initialTimeLeft;
    this.interval = window.setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1);
  }

  private resetInterval() {
    window.clearInterval(this.interval);
    this.startInterval();
  }

  private nextWord() {
    this.generatingNewWord = true;
    while((this.word = this.generateWordOrPalindrom()) === ''){}
    this.generatingNewWord = false;
  }

  private generateWordOrPalindrom(): string {
    const willBePalindrom = Math.random();
    const itsATrap = Math.random();
    const {MIN_TRAP_WORD_LENGTH, MIN_WORD_LENTGH} = GameComponent;
    const length = Math.floor(Math.random() * 20) + (itsATrap ? MIN_TRAP_WORD_LENGTH : MIN_WORD_LENTGH);

    if (itsATrap > 0.9) {
      return this.generateFalsePalindrom(length);
    } else if (willBePalindrom > 0.5) {
      return this.generatePalindrom(length);
    } else {
      return this.generateWord(length);
    }
  }

  private generatePalindrom(length: number) {
    let res = '';
    const halfWord = this.generateWord(Math.floor(length / 2));
    if (length % 2 === 0) {
      res = halfWord + this.reverseWord(halfWord);
    } else {
      res = halfWord + this.generateWord(1) + this.reverseWord(halfWord);
    }
    return res;
  }

  private generateFalsePalindrom(length: number) {
    let res = this.generatePalindrom(length - 1);
    return `${res.substring(0, res.length / 2)}${this.generatePalindrom(1)}${res.substring(res.length / 2, res.length)}`;
  }

  private reverseWord(word: string) {
    return word.split('').reverse().join('');
  }

  private generateWord(length: number) {
    let res = '';

    for (let i = 0; i < length; i++) {
      if (this.shouldPickVowelForNextLetter(res)) {
        res += this.pickRandomLetterFrom(GameComponent.vowels);
      } else {
        res += this.pickRandomLetterFrom(GameComponent.consonnants);
      }
    }
    return res;
  }

  private pickRandomLetterFrom(lettersArray: string[]) {
    return lettersArray[Math.floor(Math.random() * lettersArray.length)];
  }

  private shouldPickVowelForNextLetter(word: string) {
    return this.isConsonnant(word[word.length - 1]);
  }

  private checkIsPalindrom(word: string = ''): boolean {
    return this.reverseWord(word.toLowerCase().replace(/ /g, '')) === word.toLowerCase().replace(/ /g, '');
  }

  private endGame() {
    this.ended = true;
    window.clearInterval(this.interval);
  }

  private isConsonnant(letter: string) {
    return GameComponent.consonnants.includes(letter);
  }

}
