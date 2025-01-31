# NEET Student Rank Predictor

[![Vercel Deployment](https://vercel.com/button)](https://student-rank-predictor-seven.vercel.app)

The NEET Student Rank Predictor is a Next.js-based web application designed to analyze student performance in quizzes and predict their ranks based on historical data. This tool is especially tailored for NEET aspirants, offering insightful metrics and recommendations to improve their preparation.

## Features

- **Quiz Analysis**: Analyze the performance of students in quizzes, including metrics such as accuracy, speed, and mistakes corrected.
- **Rank Prediction**: Predict student ranks based on historical quiz data.
- **Interactive Visualizations**: Performance metrics visualized using charts for better understanding.
- **Detailed Insights**: Gain insights into areas of improvement with personalized suggestions.

## Deployment

The application is deployed on Vercel and accessible at:

[Student Rank Predictor](https://student-rank-predictor-seven.vercel.app)

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Hosting**: Vercel

## Installation

To run the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/student-rank-predictor.git
   cd student-rank-predictor
   ```

2. Install dependencies using pnpm:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## File Structure

```
student-rank-predictor/
├── components/        # Reusable UI components
├── pages/             # Application routes
├── public/            # Static assets
├── styles/            # Global styles and Tailwind configurations
├── utils/             # Helper functions and utilities
├── package.json       # Project dependencies and scripts
```

## Data Requirements

The application relies on the following JSON files for quiz and submission data:

- **currentQuiz.json**: Contains the latest quiz details.
- **historicalSubmissions.json**: Holds historical quiz submission data.

Ensure these files are correctly configured and placed in the public directory for accurate analysis.

## Usage

1. Open the application in your browser.
2. View performance metrics for the latest quiz.
3. Explore historical performance trends.
4. Use personalized recommendations to improve your quiz performance.

## Key Metrics

- **Accuracy**: Percentage of correct answers.
- **Speed**: Time taken to answer questions.
- **Final Score**: Calculated based on correct and incorrect answers.
- **Mistakes Corrected**: Number of mistakes resolved during the quiz.
- **Better Than**: Percentage of students outperformed.

## Future Enhancements

- Add support for more detailed rank prediction algorithms.
- Integrate a dashboard for tracking long-term progress.
- Provide downloadable performance reports.
- Allow customization of quiz settings and metrics.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- **Next.js** for the seamless development experience.
- **Recharts** for data visualizations.
- **Vercel** for hassle-free deployment.

---

Feel free to contribute to this project by submitting issues or feature requests! Your feedback is valuable.

