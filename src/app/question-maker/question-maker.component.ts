import { Component, OnInit } from '@angular/core';
import { Question } from '../model/questions.model';
import { QuestionMakerService } from 'src/app/services/question-maker.service';
import { createInput } from '@angular/compiler/src/core';
import { FormsModule } from '@angular/forms'
import { QuestionsService } from '../services/questions.service';



@Component({
  selector: 'app-question-maker',
  templateUrl: './question-maker.component.html',
  styleUrls: ['./question-maker.component.css']
})

export class QuestionMakerComponent implements OnInit {
  
  currentQuestion: Question = new Question;

  currentType: string;

  constructor(public questionMakerService: QuestionMakerService, public questionService: QuestionsService) {

    this.currentQuestion.answers = [''];
     
  }

  ngOnInit(): void {

  }

  addNewAnswer() {
    this.currentQuestion.answers.push('');
    // Pushes the answer written into the answers array that was created
  }

  saveQuestion() {
    this.currentQuestion.isAnsweredTF = false;
    this.currentQuestion.isCorrectTF = false;
    console.log('current question: ', this.currentQuestion);
    this.currentQuestion.answers.shift();
    this.questionService.saveQuestion(this.currentQuestion, this.currentType);
    this.currentQuestion = new Question();
    this.currentQuestion.answers = [''];
    // resets in order to write a new question 
  }
}

