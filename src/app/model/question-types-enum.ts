export enum QuestionTypes {
    MultipleChoice = 0, 
    FillInTheBlank = 1,
    DropDown = 2
    // Each type of question is given a value from 0-2
    // The set question type method in questions.service.ts will generate a random number with a value from 0-2 
    // 
}