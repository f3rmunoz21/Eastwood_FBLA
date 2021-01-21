export class Question{
    correctAnswer: string;
    question:string;
    answers:string[];
    isAnsweredTF: boolean;
    isCorrectTF: boolean;
}
export class Questions {
    questions: Question[];
}
export class MixAndMatch {
    // questions: Question[];
    MAndMQuestions: Questions[];
}
export class MixAndMatchArray { 
    MAndMQuestions: MixAndMatch[];
}