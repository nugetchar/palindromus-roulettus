import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
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

  private static readonly vowels = 'aeiouy '.split('');
  private static readonly consonnants = 'bcdfghjklmnpqrstvwxz'.split('');
  private static readonly decreaseInterval = 5;

  constructor() { }

  ngOnInit(): void {
  }

  startGame() {
    this.ended = false;
    this.started = true;
    this.initialTimeLeft = 500;
    this.score = 0;
    this.resetInterval();
    this.nextWord();
  }

  resetGame() {
    this.endGame();
    this.startGame();
  }

  checkAnswer(word: string, isPalindrome: boolean) {
    if (this.checkIsPalindrome(word) !== isPalindrome) {
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
    while((this.word = this.generateWordOrPalindrome()) === ''){}
    this.generatingNewWord = false;
  }

  private generateWordOrPalindrome(): string {
    const willBePalindrome = Math.random();
    const length = Math.floor(Math.random() * 20) + 1;
    if (willBePalindrome > 0.5) {
      return this.generatePalindrome(length);
    } else {
      return this.generateWord(length);
    }
  }

  private generatePalindrome(length: number) {
    let res = '';
    const halfWord = this.generateWord(Math.floor(length / 2));
    if (length % 2 === 0) {
      res = halfWord + this.reverseWord(halfWord);
    } else {
      res = halfWord + this.generateWord(1) + this.reverseWord(halfWord);
    }
    return res;
  }

  private reverseWord(word: string) {
    return word.split('').reverse().join('');
  }

  private generateWord(length: number) {
    let res = '';
    for (let i = 0; i < length; i++) {
      if (this.shouldPickVowel(i)) {
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

  private shouldPickVowel(i: number) {
    return i%2 === 0;
  }

  private checkIsPalindrome(word: string = ''): boolean {
    return this.reverseWord(word.toLowerCase().replace(/ /g, '')) === word.toLowerCase().replace(/ /g, '');
  }

  private endGame() {
    this.ended = true;
    window.clearInterval(this.interval);
  }

}
