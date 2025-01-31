interface QuizData {
    accuracy: string;
    correct_answers: number;
    incorrect_answers: number;
    final_score: string;
    rank_text: string;
    // Add other fields as needed
  }
  
  export const fetchStudentMarks = async (): Promise<number | null> => {
    try {
      const proxyUrl = "https://api.allorigins.win/get?url=";
      const encodedUrl = encodeURIComponent("https://api.jsonserve.com/rJvd7g");
      
      const response = await fetch(`${proxyUrl}${encodedUrl}`);
      const proxyData = await response.json();
      
      const quizData: QuizData = JSON.parse(proxyData.contents);
  
      const marks = quizData.final_score 
        ? parseFloat(quizData.final_score)
        : calculateManualMarks(quizData);
  
      return marks;
  
    } catch (error) {
      console.error("Failed to fetch marks:", error);
      return null;
    }
  };
  
  const calculateManualMarks = (quizData: QuizData): number => {
    const correct = quizData.correct_answers || 0;
    const incorrect = quizData.incorrect_answers || 0;
    
    return (correct * 4) - (incorrect * 1);
  };
  

  const displayMarks = async () => {
    const marks = await fetchStudentMarks();
    if (marks !== null) {
      console.log(`Student Marks: ${marks}/100`);
    } else {
      console.log("Failed to load marks");
    }
  };
  
  displayMarks();