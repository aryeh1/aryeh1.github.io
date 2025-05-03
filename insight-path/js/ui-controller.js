// Manages UI interactions and display

const ThoughtMazeUI = (function() {
    // Show question and choices
    function displayQuestion(questionKey) {
        const questionTree = ThoughtMazeData.getQuestionTree();
        const questionData = questionTree[questionKey];
        
        document.getElementById('current-question').textContent = questionData.question;
        
        let contextHTML = `<p>${questionData.context}</p>`;
        if (questionData.quote) {
            contextHTML += `<blockquote>"${questionData.quote.text}" - <cite>${questionData.quote.source}</cite></blockquote>`;
        }
        document.getElementById('question-context').innerHTML = contextHTML;

        // Display choice options
        const choicesContainer = document.getElementById('choices');
        choicesContainer.innerHTML = '';

        if (questionData.choices && questionData.choices.length > 0) {
            questionData.choices.forEach((choice, index) => {
                const choiceButton = document.createElement('button');
                choiceButton.className = 'choice-btn';
                choiceButton.textContent = choice.text;
                choiceButton.dataset.questionKey = questionKey;
                choiceButton.dataset.choiceIndex = index;
                choicesContainer.appendChild(choiceButton);
            });
        } else {
            showSummary();
        }
    }

    // Show introduction screen
    function showIntroduction() {
        document.getElementById('introduction').classList.add('active');
        document.getElementById('introduction').classList.remove('hidden');
        document.getElementById('maze-container').classList.add('hidden');
        document.getElementById('maze-container').classList.remove('active');
        document.getElementById('summary').classList.add('hidden');
        document.getElementById('summary').classList.remove('active');
    }
    
    // Show maze screen
    function showMaze() {
        document.getElementById('introduction').classList.remove('active');
        document.getElementById('introduction').classList.add('hidden');
        document.getElementById('maze-container').classList.remove('hidden');
        document.getElementById('maze-container').classList.add('active');
        document.getElementById('summary').classList.add('hidden');
        document.getElementById('summary').classList.remove('active');
    }
    
    // Show summary screen
    function showSummary() {
        document.getElementById('introduction').classList.remove('active');
        document.getElementById('introduction').classList.add('hidden');
        document.getElementById('maze-container').classList.remove('active');
        document.getElementById('maze-container').classList.add('hidden');
        document.getElementById('summary').classList.remove('hidden');
        document.getElementById('summary').classList.add('active');
    }
    
    // Display wisdom book content
    function displayWisdomBook(content) {
        document.getElementById('wisdom-book').innerHTML = content;
    }
    
    // Public API
    return {
        displayQuestion,
        showIntroduction,
        showMaze,
        showSummary,
        displayWisdomBook
    };
})();