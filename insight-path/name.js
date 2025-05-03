document.addEventListener('DOMContentLoaded', function() {
    // מערכי תוכן
    const philosophicalQuotes = [
        { text: "דע את עצמך", source: "סוקרטס" },
        { text: "אני חושב משמע אני קיים", source: "רנה דקארט" },
        { text: "האדם הוא תבנית נוף מולדתו", source: "ש. טשרניחובסקי" },
        { text: "כל אדם צריך שתהיינה לו שתי כיסים. באחד פתק: 'בשבילי נברא העולם', ובשני: 'ואנכי עפר ואפר'", source: "רבי שמחה בונים מפשיסחא" }
    ];

    const jewishWisdom = [
        { text: "אם אין אני לי, מי לי? וכשאני לעצמי, מה אני? ואם לא עכשיו, אימתי?", source: "הלל הזקן, אבות א', י\"ד" },
        { text: "איזהו חכם? הרואה את הנולד", source: "מסכת תמיד" },
        { text: "הוי דן כל אדם לכף זכות", source: "פרקי אבות א', ו'" },
        { text: "לא עליך המלאכה לגמור, ולא אתה בן חורין להיבטל ממנה", source: "פרקי אבות ב', ט\"ז" }
    ];

    // מבנה נתונים למבוך המחשבות
    const questionTree = {
        "meaning": {
            question: "מהי משמעות החיים עבורי?",
            context: "שאלה עתיקה כמו האנושות עצמה. מה מעניק לחייך תכלית ומשמעות?",
            choices: [
                {
                    text: "משמעות החיים נמצאת בחיבורים עם אנשים אחרים",
                    next: "meaning_connection"
                },
                {
                    text: "משמעות החיים היא בהגשמה עצמית והתפתחות",
                    next: "meaning_growth"
                },
                {
                    text: "משמעות החיים קשורה לרוחניות ולמימד שמעבר לחומר",
                    next: "meaning_spiritual"
                }
            ]
        },
        "meaning_connection": {
            question: "איזה סוג של קשרים הכי משמעותיים עבורך?",
            context: "קשרים אנושיים מגיעים בצורות רבות. איזה מהם נותן לך את התחושה העמוקה ביותר של משמעות?",
            quote: philosophicalQuotes[0],
            choices: [
                {
                    text: "קשרים משפחתיים וקרובים",
                    next: "connection_family"
                },
                {
                    text: "חברויות עמוקות ומשמעותיות",
                    next: "connection_friends"
                },
                {
                    text: "תרומה לקהילה והשפעה חברתית",
                    next: "connection_community"
                }
            ]
        },
        // יש להוסיף פה עוד הרבה שאלות ותשובות המשך
    };

    let currentQuestion = null;
    let userPath = [];
    let mazeVisualization = null;

    // אתחול המבוך
    const startButtons = document.querySelectorAll('.question-btn');
    const customStartButton = document.getElementById('start-custom');
    const customQuestionInput = document.getElementById('custom-question');
    
    startButtons.forEach(button => {
        button.addEventListener('click', function() {
            const questionKey = this.getAttribute('data-question');
            startMaze(questionKey);
        });
    });

    customStartButton.addEventListener('click', function() {
        const customQuestion = customQuestionInput.value.trim();
        if (customQuestion) {
            // לשאלות מותאמות אישית אנחנו יוצרים מבנה דינמי
            startCustomMaze(customQuestion);
        }
    });

    function startMaze(questionKey) {
        currentQuestion = questionKey;
        userPath = [{
            question: questionTree[questionKey].question,
            answer: null
        }];

        document.getElementById('introduction').classList.remove('active');
        document.getElementById('introduction').classList.add('hidden');
        document.getElementById('maze-container').classList.remove('hidden');
        document.getElementById('maze-container').classList.add('active');

        displayQuestion(questionKey);
        initMazeVisualization();
    }

    function startCustomMaze(question) {
        // יצירת שאלות דינמיות בהתבסס על שאלת המשתמש
        // למימוש מלא יש להשתמש ב-API חיצוני או לוגיקה מורכבת יותר
        // כאן מדגימים רק את המבנה הבסיסי
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

        // הוספת שאלות המשך בסיסיות
        questionTree["custom_emotional"] = {
            question: "מה הרגש העיקרי שעולה בך כשאתה חושב על " + question + "?",
            context: "רגשות הם מפתח להבנת עצמנו ומניעינו העמוקים.",
            quote: jewishWisdom[2],
            choices: [
                { text: "המשך לשאלה הבאה", next: "summary" }
            ]
        };

        startMaze("custom");
    }

    function displayQuestion(questionKey) {
        const questionData = questionTree[questionKey];
        document.getElementById('current-question').textContent = questionData.question;
        
        let contextHTML = `<p>${questionData.context}</p>`;
        if (questionData.quote) {
            contextHTML += `<blockquote>"${questionData.quote.text}" - <cite>${questionData.quote.source}</cite></blockquote>`;
        }
        document.getElementById('question-context').innerHTML = contextHTML;

        // הצגת אפשרויות הבחירה
        const choicesContainer = document.getElementById('choices');
        choicesContainer.innerHTML = '';

        if (questionData.choices && questionData.choices.length > 0) {
            questionData.choices.forEach((choice, index) => {
                const choiceButton = document.createElement('button');
                choiceButton.className = 'question-btn';
                choiceButton.textContent = choice.text;
                choiceButton.addEventListener('click', function() {
                    selectChoice(questionKey, index);
                });
                choicesContainer.appendChild(choiceButton);
            });
        } else {
            // אם אין בחירות נוספות, זה סוף המסע
            showSummary();
        }
    }

    function selectChoice(questionKey, choiceIndex) {
        const choice = questionTree[questionKey].choices[choiceIndex];
        
        // הוספת הבחירה למסלול המשתמש
        userPath[userPath.length - 1].answer = choice.text;
        
        if (choice.next === "summary") {
            showSummary();
            return;
        }

        // הוספת השאלה הבאה למסלול
        userPath.push({
            question: questionTree[choice.next].question,
            answer: null
        });

        currentQuestion = choice.next;
        displayQuestion(choice.next);
        updateMazeVisualization();
    }

    function showSummary() {
        document.getElementById('maze-container').classList.remove('active');
        document.getElementById('maze-container').classList.add('hidden');
        document.getElementById('summary').classList.remove('hidden');
        document.getElementById('summary').classList.add('active');

        // יצירת ספר החכמה
        createWisdomBook();
    }

    function initMazeVisualization() {
        // כאן אנו מאתחלים את הוויזואליזציה של המבוך באמצעות D3.js
        // מימוש מלא דורש קוד D3 יותר מורכב
        const svg = d3.select('#maze-svg');
        svg.selectAll("*").remove();

        // יצירת נקודה ראשונית במרכז
        svg.append("circle")
            .attr("cx", 500)
            .attr("cy", 200)
            .attr("r", 20)
            .attr("fill", "#3a6ea5");

        svg.append("text")
            .attr("x", 500)
            .attr("y", 200)
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .attr("fill", "white")
            .text("התחלה");
    }

    function updateMazeVisualization() {
        // עדכון מבוך הוויזואליזציה כאשר משתמש מתקדם
        // מימוש פשוט לדוגמה
        const svg = d3.select('#maze-svg');
        
        // הוספת נקודה חדשה בכל בחירה
        const pathLength = userPath.length;
        
        svg.append("circle")
            .attr("cx", 500 + (pathLength - 1) * 80 * Math.cos(pathLength * 0.7))
            .attr("cy", 200 + (pathLength - 1) * 60 * Math.sin(pathLength * 0.7))
            .attr("r", 15)
            .attr("fill", "#c0b283");

        // הוספת קו מחבר
        if (pathLength > 1) {
            svg.append("line")
                .attr("x1", 500 + (pathLength - 2) * 80 * Math.cos((pathLength-1) * 0.7))
                .attr("y1", 200 + (pathLength - 2) * 60 * Math.sin((pathLength-1) * 0.7))
                .attr("x2", 500 + (pathLength - 1) * 80 * Math.cos(pathLength * 0.7))
                .attr("y2", 200 + (pathLength - 1) * 60 * Math.sin(pathLength * 0.7))
                .attr("stroke", "#6b7a8f")
                .attr("stroke-width", 2);
        }
    }

    function createWisdomBook() {
        const wisdomBook = document.getElementById('wisdom-book');
        let bookContent = `<h3>המסע הפילוסופי שלך</h3>`;

        // הוספת ציטוט רנדומלי מהחכמה היהודית
        const randomQuote = jewishWisdom[Math.floor(Math.random() * jewishWisdom.length)];
        bookContent += `
            <div class="quote-highlight">
                <blockquote>"${randomQuote.text}"</blockquote>
                <p>— ${randomQuote.source}</p>
            </div>
        `;

        // סיכום המסע של המשתמש
        bookContent += `<h4>השאלות והתובנות שלך:</h4><ul>`;
        
        userPath.forEach(step => {
            bookContent += `<li><strong>${step.question}</strong>`;
            if (step.answer) {
                bookContent += `<br><em>בחרת: ${step.answer}</em>`;
            }
            bookContent += `</li>`;
        });
        
        bookContent += `</ul>`;

        // הוספת תובנות סיכום
        bookContent += `
            <h4>ניתוח מסכם:</h4>
            <p>מסעך הפילוסופי חושף תבנית מחשבה המתמקדת בערכים של 
            ${userPath.length > 3 ? 'חקירה מעמיקה ו' : ''}התבוננות פנימית.</p>
            <p>המשך לשאול שאלות ולחפש תשובות. כפי שאמרו חז"ל: "הוי מתלמידי אהרן, אוהב שלום ורודף שלום, אוהב את הבריות ומקרבן לתורה".</p>
        `;

        wisdomBook.innerHTML = bookContent;

        // כפתורי סיום
        document.getElementById('restart').addEventListener('click', function() {
            location.reload();
        });

        document.getElementById('download-pdf').addEventListener('click', function() {
            alert('בגרסה המלאה: יצירת PDF מספר החכמה שלך');
        });
    }
});