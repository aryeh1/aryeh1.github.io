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

    function downloadPDF() {
        // alert("בגרסה המלאה: יצירת PDF מספר החכמה שלך");
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // כותרת
        doc.setFont("Arial", "bold");
        doc.setFontSize(20);
        doc.text("מבוך המחשבות - המסע שלי", 105, 20, null, null, "center");
        
        // תאריך
        const today = new Date();
        doc.setFontSize(12);
        doc.text(`תאריך: ${today.toLocaleDateString('he-IL')}`, 105, 30, null, null, "center");
        
        // סיכום המסע
        doc.setFont("Arial", "normal");
        doc.setFontSize(14);
        doc.text("סיכום המסע:", 190, 50, null, null, "right");
        
        // שאלות ותשובות
        let yPosition = 60;
        journey.path.forEach((step, index) => {
            if (index > 0) { // דילוג על שאלת הפתיחה
                doc.setFontSize(12);
                doc.setFont("Arial", "bold");
                doc.text(`שאלה ${index}: ${step.question}`, 190, yPosition, null, null, "right");
                yPosition += 10;
                
                doc.setFont("Arial", "normal");
                doc.text(`תשובה: ${step.answer}`, 190, yPosition, null, null, "right");
                yPosition += 20;
            }
        });
        
        // החכמה שנאספה
        yPosition += 10;
        doc.setFontSize(14);
        doc.setFont("Arial", "bold");
        doc.text("פניני חכמה:", 190, yPosition, null, null, "right");
        yPosition += 10;
        
        doc.setFontSize(12);
        doc.setFont("Arial", "italic");
        journey.wisdom.forEach(wisdom => {
            const splitWisdom = doc.splitTextToSize(wisdom, 170);
            doc.text(splitWisdom, 190, yPosition, null, null, "right");
            yPosition += splitWisdom.length * 10 + 5;
        });
        
        // סיכום
        yPosition += 10;
        doc.setFontSize(14);
        doc.setFont("Arial", "bold");
        doc.text("תובנה אישית:", 190, yPosition, null, null, "right");
        yPosition += 10;
        
        const summary = journey.generateSummary();
        const splitSummary = doc.splitTextToSize(summary, 170);
        doc.setFontSize(12);
        doc.setFont("Arial", "normal");
        doc.text(splitSummary, 190, yPosition, null, null, "right");
        
        // שמירת הקובץ
        doc.save("מבוך-המחשבות.pdf");
    }

    function handleCustomQuestion() {
        const customQuestionInput = document.getElementById('customQuestionInput');
        const customQuestion = customQuestionInput.value.trim();
        
        if (!customQuestion) {
            alert("אנא הזן שאלה");
            return;
        }
        
        // שמירת השאלה המותאמת אישית במסע
        journey.addCustomStep(customQuestion);
        
        // הצגת שדה תשובה
        const customQuestionContainer = document.getElementById('customQuestionContainer');
        customQuestionContainer.innerHTML = `
            <h3>השאלה שלך: ${customQuestion}</h3>
            <div class="form-group">
                <label for="customAnswerInput">התשובה שלך:</label>
                <textarea id="customAnswerInput" class="form-control" rows="3" placeholder="הרהר בשאלה וכתוב את תשובתך..."></textarea>
            </div>
            <button onclick="submitCustomAnswer()" class="btn btn-primary">המשך</button>
        `;
    }

    function submitCustomAnswer() {
        const customAnswerInput = document.getElementById('customAnswerInput');
        const customAnswer = customAnswerInput.value.trim();
        
        if (!customAnswer) {
            alert("אנא הזן תשובה לשאלתך");
            return;
        }
        
        // הוספת התשובה למסע
        journey.addCustomAnswer(customAnswer);
        
        // הוספת חכמה רלוונטית לשאלה מותאמת אישית
        const customWisdom = getRelevantWisdom(customAnswer);
        if (customWisdom) {
            journey.addWisdom(customWisdom);
        }
        
        // המשך המסע
        displayNextQuestion();
    }

    function getRelevantWisdom(answer) {
        // מציאת חכמה רלוונטית בהתאם למילות מפתח בתשובה
        const keywords = {
            'אושר': '"איזהו עשיר? השמח בחלקו" - פרקי אבות',
            'חיים': '"בחרת בחיים" - דברים ל:יט',
            'אהבה': '"ואהבת לרעך כמוך" - ויקרא יט:יח',
            'דאגה': '"אל תדאג דאגת מחר, כי לא תדע מה ילד יום" - משלי כז:א',
            'עבודה': '"בזעת אפיך תאכל לחם" - בראשית ג:יט',
            'חינוך': '"חנוך לנער על פי דרכו" - משלי כב:ו',
        };
        
        // בדיקה אם התשובה מכילה מילות מפתח
        for (const [keyword, wisdom] of Object.entries(keywords)) {
            if (answer.includes(keyword)) {
                return wisdom;
            }
        }
        
        // חכמה כללית אם אין התאמה ספציפית
        return '"הוי דן את כל האדם לכף זכות" - פרקי אבות';
    }

    // הוספה למחלקת Journey
    Journey.prototype.addCustomStep = function(question) {
        this.currentNode = 'custom_' + this.path.length;
        this.path.push({
            id: this.currentNode,
            question: question,
            isCustom: true
        });
    };

    Journey.prototype.addCustomAnswer = function(answer) {
        // עדכון הצעד האחרון עם התשובה
        const lastStep = this.path[this.path.length - 1];
        lastStep.answer = answer;
    };

    Journey.prototype.saveJourney = function() {
        // המרת המסע לפורמט JSON ושמירה ב-localStorage
        const journeyData = {
            path: this.path,
            wisdom: this.wisdom,
            currentNode: this.currentNode
        };
        localStorage.setItem('insightPathJourney', JSON.stringify(journeyData));
        
        // שמירת תאריך ושעה
        localStorage.setItem('insightPathTimestamp', new Date().toISOString());
    };

    Journey.prototype.loadJourney = function() {
        // טעינת מסע שמור מ-localStorage
        const savedJourney = localStorage.getItem('insightPathJourney');
        if (savedJourney) {
            const journeyData = JSON.parse(savedJourney);
            this.path = journeyData.path;
            this.wisdom = journeyData.wisdom;
            this.currentNode = journeyData.currentNode;
            return true;
        }
        return false;
    };

    // פונקציות עבור ממשק המשתמש
    function saveCurrentJourney() {
        journey.saveJourney();
        showSavedMessage();
    }

    function loadSavedJourney() {
        if (journey.loadJourney()) {
            // התאמת הממשק למסע הטעון
            updateUIFromLoadedJourney();
        } else {
            alert("לא נמצא מסע שמור");
        }
    }

    function showSavedMessage() {
        const timestamp = new Date().toLocaleString('he-IL');
        const saveConfirmation = document.createElement('div');
        saveConfirmation.className = 'alert alert-success fade-in';
        saveConfirmation.innerHTML = `המסע נשמר בהצלחה! <small>${timestamp}</small>`;
        
        document.getElementById('journeyContainer').prepend(saveConfirmation);
        
        // הסרת ההודעה לאחר 3 שניות
        setTimeout(() => {
            saveConfirmation.classList.add('fade-out');
            setTimeout(() => saveConfirmation.remove(), 1000);
        }, 3000);
    }

    function updateUIFromLoadedJourney() {
        // מציג את השלב האחרון של המסע הטעון
        const lastStep = journey.path[journey.path.length - 1];
        
        // עדכון הממשק בהתאם לשלב האחרון
        document.getElementById('questionContainer').innerHTML = `
            <h2>${lastStep.question}</h2>
            <p><strong>התשובה שלך:</strong> ${lastStep.answer || ''}</p>
            <div class="mt-4">
                <button onclick="displayNextQuestion()" class="btn btn-primary">המשך</button>
            </div>
        `;
        
        // עדכון הויזואליזציה
        updateVisualization();
    }

    // הוספת כפתורי שמירה וטעינה לממשק
    function addStorageButtons() {
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'storage-buttons';
        buttonsContainer.innerHTML = `
            <button onclick="saveCurrentJourney()" class="btn btn-outline-secondary btn-sm">
                <i class="fas fa-save"></i> שמירת המסע
            </button>
            <button onclick="loadSavedJourney()" class="btn btn-outline-secondary btn-sm">
                <i class="fas fa-history"></i> טעינת מסע קודם
            </button>
        `;
        
        document.getElementById('journeyContainer').appendChild(buttonsContainer);
    }

    // הפעלת הכפתורים בטעינת הדף
    document.addEventListener('DOMContentLoaded', function() {
        addStorageButtons();
    });
    
    // Public API
    return {
        init: initJourney,
        createCustomQuestion: createCustomQuestionTree,
        recordUserChoice: recordChoice,
        getCurrentQuestion: () => currentQuestion,
        getUserPath: () => userPath,
        generateSummaryContent: generateSummary,
        downloadPDF: downloadPDF
    };
})();