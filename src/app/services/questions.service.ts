import { Injectable } from '@angular/core';
import { MixAndMatch, MixAndMatchArray, Question, Questions } from 'src/app/model/questions.model';
import { AngularFirestoreModule, DocumentSnapshot, AngularFirestore } from '@angular/fire/firestore';
import { QuestionTypes } from 'src/app/model/question-types-enum';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  currentQuestions: Question[];
  currentQuestion: Question;
  answeredQuestions: Question[] = [];
  answeredMixAndMatch: Questions[] = [];
  currentIndex: number;
  wrongAnswers: number;
  rightAnswers: number;
  points: number;
  multipleTF = false; 
  fillInTheBlankTF = false; 
  mixAndMatchTF = true; 
  dropDownTF = false; 
  currentMixAndMatch: Questions; 
  mixAndMatch: Questions[];
  questionTypes = QuestionTypes;
  mixAndMatchCC: Questions[];
  currentMixAndMatchAnswers: string[] = [];
  dropDownTestsTF = true;

  constructor(private firestore: AngularFirestore) {
    this.GetQuestions('CyberSec');
    // this.GetMixAndMatch('Journalism');
    
  }

  GetQuestions(type: string) {
    console.log(type);
    const ret = this.firestore.collection('FBLA').doc(type + 'Questions').get();
    ret.subscribe(res => {
      console.log(res);
      if (res.exists) {
        const questions = (res.data());
        this.currentQuestions = questions.questions;
        console.log(this.currentQuestions);
        if (this.currentQuestions) {
          this.wrongAnswers = 0;
          this.rightAnswers = 0;
          this.points = 0;
          this.currentQuestion = new Question();
          this.currentQuestion = this.SetCurrentQuestion();
          this.setQuestionType(); 
          console.log(this.fillInTheBlankTF);
        } else {
          this.currentQuestions = [];
          console.log(this.currentQuestions);
        }
      } 
    }
      , err => {
        console.log('Something went wrong while getting ' + type + 'questions', err);
      });
  }

  GetMixAndMatch(type: string) { 
    this.mixAndMatchTF = true;
    const ret = this.firestore.collection('FBLA').doc(type + 'MixAndMatch').get();
    ret.subscribe(res => {
      if (res.exists) {
        const results = (res.data());
        console.log(results);
        this.mixAndMatch = results.MAndMQuestions;
        this.mixAndMatchCC = results.MAndMQuestions;
        this.currentMixAndMatch = this.SetCurrentMixAndMatch();
        this.setCurrentMixAndMatchAnswers();
        console.log(this.currentMixAndMatch);
      } 
    }
      , err => {
        console.log('Something went wrong while getting ' + type + 'Mix and Match', err);
      });
  }

  SetCurrentMixAndMatch() : Questions { 
    console.log(this.mixAndMatch);
    const randomIndex = Math.floor(Math.random() * (this.mixAndMatch.length - .5));
    this.currentIndex = randomIndex;
    return this.mixAndMatch[this.currentIndex];
  }

  setCurrentMixAndMatchAnswers() { 
    this.currentMixAndMatch.questions.forEach(question => {
      console.log(question.correctAnswer); 
      this.currentMixAndMatchAnswers.push(question.correctAnswer);
    });
  }

  mixAndMatchQuestionWasAnswered(index: number) { 
    this.currentMixAndMatchAnswers.splice(index, 1);
    if (this.currentMixAndMatchAnswers.length == 0) {
      this.mixAndMatchTF = false;
    }
  }

  SetCurrentQuestion(): Question {
    const randomIndex = Math.floor(Math.random() * (this.currentQuestions.length - .5));
    this.currentIndex = randomIndex;
    return this.currentQuestions[this.currentIndex];

  }

  setQuestionType() { 
    this.fillInTheBlankTF = false; 
    this.multipleTF = false; 
    this.dropDownTF = false; 
    const typeNumber = Math.floor(Math.random()*3); 
    console.log((typeNumber == this.questionTypes.DropDown));
    if (typeNumber == this.questionTypes.MultipleChoice) {
      this.multipleTF = true; 
    } else if (typeNumber == this.questionTypes.FillInTheBlank) {
      this.fillInTheBlankTF = true; 
    } 
    else if (typeNumber == this.questionTypes.DropDown) { 
      this.dropDownTF = true;
    }
    // console.log(this.dropDownTF);
    console.log(typeNumber);
  }

  GetResult(answer: string) {
    if (answer === this.currentQuestion.correctAnswer) {
      console.log('You are correct! You gained a point.'); // maybe questions have a difficulty rating or points given
      this.rightAnswers++;
      this.points++;
      this.currentQuestion.isCorrectTF = true;
    } else {
      console.log('You got it wrong. The correct answer was: ', this.currentQuestion.correctAnswer);
      this.wrongAnswers++;
      this.currentQuestion.isCorrectTF = false;
    }
    this.currentQuestion.isAnsweredTF = true;
  }

  getResultMixAndMatch(question: Question, answer: string, questionIndex: number) {
    if (answer === question.correctAnswer) {
      console.log('You are correct! You gained a point.'); // maybe questions have a difficulty rating or points given
      this.rightAnswers++;
      this.points++;
      this.mixAndMatch[this.currentIndex].questions[questionIndex].isCorrectTF = true;
    } else {
      this.wrongAnswers++;
      this.mixAndMatch[this.currentIndex].questions[questionIndex].isCorrectTF = false;
    }
    this.mixAndMatch[this.currentIndex].questions[questionIndex].isAnsweredTF = true;
  
  }

  NextQuestion(){
    this.currentQuestions.splice(this.currentIndex, 1);
    this.answeredQuestions.push(this.currentQuestion);
    this.currentQuestion = this.SetCurrentQuestion();
    this.setQuestionType(); 
  }

  saveQuestion(question: Question, questionType: string) {
    const q = new Questions();
    this.currentQuestions.push({...question});
    // if (this.currentQuestions) {
    //   this.currentQuestions.push({...question});
    // } else {
    //   this.currentQuestions = [];
    //   this.currentQuestions.push({...question});
    // }
    q.questions = this.currentQuestions;
    console.log(this.currentQuestions);
    const questions = {...q};
    const ret = this.firestore.collection('FBLA').doc(questionType + 'Questions')
      .set(questions, { merge: true })
      .then(res => {
        console.log('Saved question: result', res);
      })
      .catch(err => {
        console.log('Could not save question', err);
      });
  }
  // makeQuestionIntoSimpleObject(question: Question) {
  //   const questions = [];
  //   this.currentQuestions.forEach(question =>{

  //   })
  // }
  GetPercent() {
    const percent = this.rightAnswers/(this.rightAnswers + this.wrongAnswers); 
    return this.GetPercent; 
  }
}
