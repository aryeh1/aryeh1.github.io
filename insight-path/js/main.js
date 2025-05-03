// Main application entry point

document.addEventListener('DOMContentLoaded', function() {
    // Initialize event listeners for starting buttons
    const startButtons = document.querySelectorAll('.start-btn');
    const customStartButton = document.getElementById('start-custom');
    const customQuestionInput = document.getElementById('custom-question');
    
    // Standard question buttons
    startButtons.forEach(button => {
        button.addEventListener('click', function() {
            const questionKey = this.getAttribute('data-question');
            startMaze(questionKey);
        });
    });

    // Custom question button
    customStartButton.addEventListener('click', function() {
        const customQuestion = customQuestionInput.value.trim();
        if (customQuestion) {
            const questionKey = ThoughtMazeJourney.createCustomQuestion(customQuestion);
            startMaze(questionKey);
        }
    });
    
    // Set up dynamic event delegation for choice buttons
    document.getElementById('choices').addEventListener('click', function(event) {
        if (event.target.classList.contains('choice-btn')) {
            const questionKey = event.target.dataset.questionKey;
            const choiceIndex = parseInt(event.target.dataset.choiceIndex);
            handleChoice(questionKey, choiceIndex);
        }
    });
    
    // Set up restart and download buttons
    document.getElementById('restart').addEventListener('click', function() {
        location.reload();
    });

    document.getElementById('download-pdf').addEventListener('click', function() {
        alert('בגרסה המלאה: יצירת PDF מספר החכמה שלך');
    });
    
    // Responsive visualization
    window.addEventListener('resize', function() {
        const pathLength = ThoughtMazeJourney.getUserPath().length;
        if (pathLength > 0) {
            ThoughtMazeViz.redrawAll(pathLength);
        }
    });
    
    // Start maze with selected question
    function startMaze(questionKey) {
        // Initialize journey and UI
        ThoughtMazeJourney.init(questionKey);
        ThoughtMazeUI.showMaze();
        ThoughtMazeUI.displayQuestion(questionKey);
        ThoughtMazeViz.initialize();
    }
    
    // Handle user choice selection
    function handleChoice(questionKey, choiceIndex) {
        const result = ThoughtMazeJourney.recordUserChoice(questionKey, choiceIndex);
        
        if (result.isComplete) {
            finishJourney();
        } else {
            ThoughtMazeUI.displayQuestion(result.nextQuestion);
            ThoughtMazeViz.updateVisualization(result.userPath.length);
        }
    }
    
    // Complete the journey and show summary
    function finishJourney() {
        const summaryContent = ThoughtMazeJourney.generateSummaryContent();
        ThoughtMazeUI.displayWisdomBook(summaryContent);
        ThoughtMazeUI.showSummary();
    }
});