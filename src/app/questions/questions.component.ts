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
  }
  Restart(): void {
    if (this.type === undefined) {
      this.questionsService.GetQuestions(this.type);
      this.questionsService.GetMixAndMatch(this.type);
    } else {
      this.questionsService.GetQuestions(this.type);
      this.questionsService.GetMixAndMatch(this.type);
      console.log("restart is working");
    }
  }

  submit() { 
    this.questionsService.GetResult(this.typedAnswer);
  }

  setCurrentQuestion(question: Question, index: number) {
    this.index = index;
    this.currentQuestion = question; 
    this.sendAnswers();
    console.log("questions is running");
  }

  setCurrentAnswer(answer: string, index: number) { 
    this.indexAnswer = index;
    this.currentAnswer = answer;
    this.sendAnswers();
    console.log("answers is running");
  }

  sendAnswers() { 
    if (this.currentAnswer != null && this.currentQuestion != null) { 
      this.questionsService.mixAndMatchQuestionWasAnswered(this.indexAnswer);
      this.questionsService.getResultMixAndMatch(this.currentQuestion, this.currentAnswer, this.index);
      this.currentQuestion = null;
      this.currentAnswer = null;
    }  
  }

  getTests(type: string) { 
    this.type = type;
    this.questionsService.GetQuestions(this.type);
    this.questionsService.GetMixAndMatch(this.type);
    this.questionsService.dropDownTestsTF = false;
  }
}
