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
  quitTF = false;
  percent: number; 

  constructor(private firestore: AngularFirestore) {
    this.GetQuestions('CyberSec');
    // this.GetMixAndMatch('Journalism');
  }

  GetQuestions(type: string) {
    // console.log(type);
    const ret = this.firestore.collection('FBLA').doc(type + 'Questions').get();
    // const ret is told to look into firebase and look for the FBLA project 
    // const ret also uses the type selected in questions.html and adds Question to the string in order 
    // to look for the questions corresponding to that quiz/test
    ret.subscribe(res => {
      console.log(res);
      // res.subscribe makes res true
      if (res.exists) {
        const questions = (res.data());
        this.currentQuestions = questions.questions;
        console.log(this.currentQuestions);
        // currentQuestions array is set equal to the array of questions in the database
        if (this.currentQuestions) {
          this.wrongAnswers = 0;
          this.rightAnswers = 0;
          this.points = 0;
          // sets all the score variables equal to zero in order begin the counting process of the test/quiz
          this.currentQuestion = new Question();
          this.currentQuestion = this.SetCurrentQuestion();
          // sets currentQuestion equal to SetCurrentQuestion and runs it
          this.setQuestionType(); 
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
    // Looks into FBLA in firebase and adds the type selected to 'MixAndMatch' to get the corresponding MixAndMatch
    ret.subscribe(res => {
      if (res.exists) {
        const results = (res.data());
        console.log(results);
        this.mixAndMatch = results.MAndMQuestions;
        this.mixAndMatchCC = results.MAndMQuestions;
        this.currentMixAndMatch = this.SetCurrentMixAndMatch();
        this.setCurrentMixAndMatchAnswers();
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
      // console.log(question.correctAnswer); 
      this.currentMixAndMatchAnswers.push(question.correctAnswer);
    });
    
  }

  mixAndMatchQuestionWasAnswered(index: number) { 
    this.currentMixAndMatchAnswers.splice(index, 1);
    // splices the currentMixAndMatchAnswers at the current index to delete the question and 
    // the answer selected
    if (this.currentMixAndMatchAnswers.length == 0) {
      this.mixAndMatchTF = false;
      // Once the currentMixAndMatchAnswers array is equal to zero, meaning that the the user has answered 
      // all the questions then the mixAndMatch boolean will be set to false
    }
    
  }

  SetCurrentQuestion(): Question {
    const randomIndex = Math.floor(Math.random() * (this.currentQuestions.length - .5));
    // const randomIndex is a number generated by using math.random to multiply the length of the currentQuestions.length -.5
    // Math.floor is then used to round the number down to avoid the use of decimal numbers
    this.currentIndex = randomIndex;
    // randomInedex is set equal to currentIndex
    return this.currentQuestions[this.currentIndex];
    // the currentIndex number is then used as the currentQuestions array's index 
    // Doing this allows the randomization of the questions as opposed to just displaying the array of questions in order
  }

  setQuestionType() { 
    this.fillInTheBlankTF = false; 
    this.multipleTF = false; 
    this.dropDownTF = false; 
    // All booleans are set to false in order to reuse this method
    const typeNumber = Math.floor(Math.random()*3); 
    // Math.random is used to generate a number, this number will always be between 0 and 1 
    // This number is then multiplied by three in order to make this number between 0 and 3 
    // Because Math.random is used the number may contain a decimal and the number generated might look something like "1.3"
    // The question types have an assigned number from 0-2  
    // Math.floor is then used to round this number to a whole number to avoid the use of decimals
    // console.log((typeNumber == this.questionTypes.DropDown));
    // typeNumber is then compared to QuestionTypes in quesitno-types-enums.ts
    if (typeNumber == this.questionTypes.MultipleChoice) {
      this.multipleTF = true; 
      console.log(typeNumber + ":Multiple Choice type Question");
    } else if (typeNumber == this.questionTypes.FillInTheBlank) {
      this.fillInTheBlankTF = true; 
      console.log(typeNumber + ":Fill in The Blank type Question");
    } else if (typeNumber == this.questionTypes.DropDown) { 
      this.dropDownTF = true;
      console.log(typeNumber + ":Drop Down Menu type Question");
    }
    // If the type number is equal to the question number then the True or False boolean for the corresponding 
    // type of question will be true allowing the question to be displayed in the corresponding question format set. 
    // Console.log will report what kind of question is being presented. 
    
  }

  GetResult(answer: string) {
    if (answer === this.currentQuestion.correctAnswer) {
      this.currentQuestion.isCorrectTF = true;
      // The answer selected is compared to the correctAnswer in the database 
    } else {
      this.currentQuestion.isCorrectTF = false;
      // If the answer selected does not match the wrongAnswers will have 1 added to it 
      // rightAnswers and wrongAnswers are counters used for the resutls
    }
    this.currentQuestion.isAnsweredTF = true;
    // Making isAnsweredTF will allow the Next button to be displayed 
  }

  getResultMixAndMatch(question: Question, answer: string, questionIndex: number) {
    if (answer === question.correctAnswer) {
      this.rightAnswers = this.rightAnswers + 0.25;
      console.log("Mix and Match Answer is correct"); 
      console.log("Current Right Answers:" + this.rightAnswers);
      this.mixAndMatch[this.currentIndex].questions[questionIndex].isCorrectTF = true;
      // If the answer selected is equal to the correct answer in the database, then the user will receive points.
      // Because the Mix and match question has 4 terms but is only one question, each term is worth 0.25 points to give the 
      // Total question a value of one point. If the answer is correct the isCorrect boolean for the current question/term will be true
    } else {
      this.wrongAnswers = this.wrongAnswers+0.25;
      this.mixAndMatch[this.currentIndex].questions[questionIndex].isCorrectTF = false;
      console.log("Mix and Match Answer is incorrect");
      console.log("Current Wrong Answers:" + this.wrongAnswers);
      // If the answer is incorrect then 0.25 will be added to the wrongAnswers number and the isCorrect boolean for the current 
      // question will be set to false.
    }
    this.points= this.points+0.25;
    console.log("Current Questions in the test/quiz:" + this.points);
    this.mixAndMatch[this.currentIndex].questions[questionIndex].isAnsweredTF = true;
    // The points number will serve as a counter for the amount of questions that are in the quiz/test
    // The value that a question has will always be added to the points number regardless if the question was right or wrong 
  
  }

  NextQuestion(index: number) {
    // this.currentMixAndMatchAnswers.splice(index, 1);
    // if (this.currentMixAndMatchAnswers.length == 0) {
    //   this.mixAndMatchTF = false;
    // }
    if(this.currentQuestion.isCorrectTF) {
      this.rightAnswers++;
      console.log("Answer is correct"); 
      console.log("Current Right Answers:" + this.rightAnswers);
    } else {
      this.wrongAnswers++;
      console.log("Answer is incorrect");
      console.log("Wrong Answers:" + this.wrongAnswers);
    }
    this.points++;
    this.percent = (this.rightAnswers*100);
    this.percent = this.percent/this.points;
    console.log("Current Score:" + this.percent);
    // The points number keeps track of the amount of questions that have been answered. 
    // Because the amount of right answers has been tracked, the right answers by 100 
    // divided by the total questions answered will be the percent of questions answered correctly. 
    // The percent updates everytime the user clicks the next button making the score update in real time. 
    this.currentQuestions.splice(this.currentIndex, 1);
    this.answeredQuestions.push(this.currentQuestion);
    // The pushing and slicing will shorten the array of the questions available and tracks to progress of the quiz/test
    this.currentQuestion = this.SetCurrentQuestion();
    // the NextQuestion method then runs the SetCurrentQUestion Method to display another question
    this.setQuestionType(); 
    // Lastly the setQuestionType method is run to set the format the question will be displayed as 
    console.log("mixAndMatchTF:" + this.mixAndMatchTF);
  }

  saveQuestion(question: Question, questionType: string) {
    const q = new Questions();
    this.currentQuestions.push({...question});
    // Pushes writen question into the questions array
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
 
}
