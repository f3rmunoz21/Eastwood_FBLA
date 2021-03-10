import { Component, OnInit, Input } from '@angular/core';
import { QuestionsService } from 'src/app/services/questions.service';
import { Question } from '../model/questions.model';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  // questions: Question[];
  type: string;
  index: number;
  currentQuestion: Question;
  isCorrectTF: boolean;
  newQuestion: Question = new Question();
  typedAnswer: string; 
  currentAnswer: string;
  indexAnswer: number;
  fillInTheBlankIsAnsweredTF: boolean; 
  blankAnswer: string; 

  constructor(public questionsService: QuestionsService) {
    // this.getQuestions(this.type);
    console.log(this.questionsService.fillInTheBlankTF);
  }
  ngOnInit(): void {
    this.currentQuestion = this.questionsService.currentQuestion;
    // console.log(this.currentQuestion)
  }
  GetQuestions(type: string): void {
    this.questionsService.GetQuestions(type);
    // Each button that is displayed for the tests available to take passes in the type parameter and runs 
    // the GetQuestions method on the questionsService.
  }

  Restart(): void {
    if (this.type === undefined) {
      this.questionsService.GetQuestions(this.type);
      this.questionsService.GetMixAndMatch(this.type);
      // If the question type for the quiz is undefined, the 
      // type will be equal to the the current type of test being taken.
    } else {
      this.questionsService.GetQuestions(this.type);
      this.questionsService.GetMixAndMatch(this.type);
      // If the question type is already defined then the quiz will 
      // restart using the type to get the questions from firebase
    }
    this.questionsService.answeredQuestions.splice(0, this.questionsService.answeredQuestions.length);
    console.log(this.questionsService.answeredQuestions);
    // The answeredQuestions array needs to be reset to zero, if the array is not reset to zero 
    // The results will display all the results for the amount of tests/quizes taken.
  }

  submit() { 
    if (this.typedAnswer) { 
      this.fillInTheBlankIsAnsweredTF = true;
      this.questionsService.GetResult(this.typedAnswer);
      this.questionsService.currentQuestion.isAnsweredTF = true;
      // If a typed answer exists then the answered booleans will be set to true and will 
      // run the GetResult method using the user's typed answer as its paramater.

    } else { 
      console.log("No answer was recorded");
      this.fillInTheBlankIsAnsweredTF = false;
      this.questionsService.currentQuestion.isAnsweredTF = false;
    }
  }

  setCurrentQuestion(question: Question, index: number) {
    this.index = index;
    this.currentQuestion = question; 
    this.sendAnswers();
    console.log("questions is running");
    // runs sendAnswers method.
  }

  setCurrentAnswer(answer: string, index: number) { 
    this.indexAnswer = index;
    this.currentAnswer = answer;
    this.sendAnswers();
    console.log("answers is running");
    // runs send answers method
  }

  sendAnswers() { 
    if (this.currentAnswer != null && this.currentQuestion != null) { 
      this.questionsService.mixAndMatchQuestionWasAnswered(this.indexAnswer);
      this.questionsService.getResultMixAndMatch(this.currentQuestion, this.currentAnswer, this.index);
      this.currentQuestion = null;
      this.currentAnswer = null;
      // If currentAnswer and currentQUestion are both not null, then the mixAndMatchQuestionWasAnswerd and the getResultMixAndMatch
      // methods will run with their corresponding paramater values being passed through.
    }  
  }

  getTests(type: string) { 
    this.type = type;
    this.questionsService.GetQuestions(this.type);
    this.questionsService.GetMixAndMatch(this.type);
    // The question type was set by the buttons in questions.components.html when the user selects the 
    // type of test/quiz they wish to take.
    this.questionsService.dropDownTestsTF = false;
    // setting the dropDownTestsTF to false will deactivate the selection menu for the tests available 
  }

}
