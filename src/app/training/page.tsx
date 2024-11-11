export const dynamic = 'force-dynamic';

// Add a function to use setTrainingProgress
const updateProgress = () => {
  setTrainingProgress((prev) => Math.min(prev + 5, 100))
} 