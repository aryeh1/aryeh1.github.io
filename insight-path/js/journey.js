// Manages the user journey and summary generation

const ThoughtMazeJourney = (function() {
    // Private variables
    let userPath = [];
    let currentQuestion = null;
    
    // Initialize a new journey
    function initJourney(questionKey) {
        const questionTree = ThoughtMazeData.getQuestionTree();
        
        currentQuestion = questionKey;
        userPath = [{
            question: questionTree[questionKey].question,
            answer: null
        }];
        
        return {
            currentQuestion,
            userPath
        };
    }
    
    // Create custom question tree for user input
    function createCustomQuestionTree(question) {
        const jewishWisdom = ThoughtMazeData.getWisdom();
        const questionTree = ThoughtMazeData.getQuestionTree();
        
        // Create custom question entries
        questionTree["custom"] = {
            question: question,
            context: "זוהי שאלה אישית שלך, בואו נחקור אותה יחד.",
            choices: [
                {
                    text: "אני רוצה לחקור את ההיבט הרגשי של השאלה",
                    next: "custom_emotional"
                },
                {
                    text: "אני רוצה לחקור את ההיבט הפרקטי של השאלה",
                    next: "custom_practical"
                },
                {
                    text: "אני רוצה לחקור את ההיבט הפילוסופי של השאלה",
                    next: "custom_philosophical"
                }
            ]
        };

        // Add basic follow-up questions
        questionTree["custom_emotional"] = {
            question: "מה הרגש העיקרי שעולה בך כשאתה חושב על " + question + "?",
            context: "רגשות הם מפתח להבנת עצמנו ומניעינו העמוקים.",
            quote: jewishWisdom[2],
            choices: [
                { text: "המשך לשאלה הבאה", next: "summary" }
            ]
        };
        
        return "custom";
    }
    
    // Record user's choice
    function recordChoice(questionKey, choiceIndex) {
        const questionTree = ThoughtMazeData.getQuestionTree();
        const choice = questionTree[questionKey].choices[choiceIndex];
        
        // Add the choice to user path
        userPath[userPath.length - 1].answer = choice.text;
        
        // Check if this leads to summary
        if (choice.next === "summary") {
            return {
                isComplete: true,
                userPath
            };
        }

        // Add next question to path
        userPath.push({
            question: questionTree[choice.next].question,
            answer: null
        });

        currentQuestion = choice.next;
        
        return {
            nextQuestion: choice.next,
            userPath,
            isComplete: false
        };
    }
    
    // Generate summary content
    function generateSummary() {
        const randomQuote = ThoughtMazeData.getRandomWisdom();
        
        let bookContent = `<h3>המסע הפילוסופי שלך</h3>`;

        // Add random Jewish wisdom quote
        bookContent += `
            <div class="quote-highlight">
                <blockquote>"${randomQuote.text}"</blockquote>
                <p>— ${randomQuote.source}</p>
            </div>
        `;

        // Summarize user journey
        bookContent += `<h4>השאלות והתובנות שלך:</h4><ul>`;
        
        userPath.forEach(step => {
            bookContent += `<li><strong>${step.question}</strong>`;
            if (step.answer) {
                bookContent += `<br><em>בחרת: ${step.answer}</em>`;
            }
            bookContent += `</li>`;
        });
        
        bookContent += `</ul>`;

        // Add concluding insights
        bookContent += `
            <h4>ניתוח מסכם:</h4>
            <p>מסעך הפילוסופי חושף תבנית מחשבה המתמקדת בערכים של 
            ${userPath.length > 3 ? 'חקירה מעמיקה ו' : ''}התבוננות פנימית.</p>
            <p>המשך לשאול שאלות ולחפש תשובות. כפי שאמרו חז"ל: "הוי מתלמידי אהרן, אוהב שלום ורודף שלום, אוהב את הבריות ומקרבן לתורה".</p>
        `;
        
        return bookContent;
    }
    
    // Public API
    return {
        init: initJourney,
        createCustomQuestion: createCustomQuestionTree,
        recordUserChoice: recordChoice,
        getCurrentQuestion: () => currentQuestion,
        getUserPath: () => userPath,
        generateSummaryContent: generateSummary
    };
})();