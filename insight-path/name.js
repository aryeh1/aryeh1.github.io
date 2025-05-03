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

    // Update the visualization functions to make them mobile responsive

    function initMazeVisualization() {
        // Initialize the visualization with D3.js, using responsive dimensions
        const svg = d3.select('#maze-svg');
        svg.selectAll("*").remove();
        
        // Calculate center point based on SVG dimensions
        const svgElement = document.getElementById('maze-svg');
        const svgWidth = svgElement.clientWidth;
        const svgHeight = svgElement.clientHeight;
        
        const centerX = svgWidth / 2;
        const centerY = svgHeight / 2;
        
        // Create initial node
        svg.append("circle")
            .attr("cx", centerX)
            .attr("cy", centerY)
            .attr("r", 20)
            .attr("fill", "#4a90e2");

        svg.append("text")
            .attr("x", centerX)
            .attr("y", centerY)
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .attr("fill", "white")
            .attr("font-size", "14px")
            .text("התחלה");
            
        // Store the center coordinates for future reference
        svg.datum({ centerX, centerY, width: svgWidth, height: svgHeight });
    }

    function updateMazeVisualization() {
        // Get the current path length
        const pathLength = userPath.length;
        if (pathLength <= 1) return; // No visualization needed for just the starting point
        
        const svg = d3.select('#maze-svg');
        const { centerX, centerY, width, height } = svg.datum();
        
        // Calculate scaling factors based on screen size
        const scaleFactor = Math.min(width, height) / 500;
        const nodeRadius = 20 * scaleFactor;
        const nodeSpacing = Math.min(60 * scaleFactor, width / 8);
        
        // Use a circular or spiral layout that works on smaller screens
        const angle = (pathLength - 1) * 0.7;
        const newX = centerX + ((pathLength - 1) * nodeSpacing * Math.cos(angle));
        const newY = centerY + ((pathLength - 1) * nodeSpacing * Math.sin(angle));
        
        // Add a line from the previous node to this one
        const prevX = pathLength > 2 
            ? centerX + ((pathLength - 2) * nodeSpacing * Math.cos((pathLength - 2) * 0.7))
            : centerX;
        const prevY = pathLength > 2 
            ? centerY + ((pathLength - 2) * nodeSpacing * Math.sin((pathLength - 2) * 0.7))
            : centerY;
        
        svg.append("line")
            .attr("x1", prevX)
            .attr("y1", prevY)
            .attr("x2", newX)
            .attr("y2", newY)
            .attr("stroke", "#6b7a8f")
            .attr("stroke-width", 2);
            
        // Add a new node for this step
        svg.append("circle")
            .attr("cx", newX)
            .attr("cy", newY)
            .attr("r", nodeRadius)
            .attr("fill", "#4a90e2");
            
        // Add the step number to the node
        svg.append("text")
            .attr("x", newX)
            .attr("y", newY)
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .attr("fill", "white")
            .attr("font-size", `${12 * scaleFactor}px`)
            .text(pathLength);
            
        // We need to ensure the new node is visible by scrolling if necessary
        const vizContainer = document.getElementById('visualization');
        if (vizContainer) {
            vizContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }

    // Add a window resize handler to make the visualization responsive
    window.addEventListener('resize', function() {
        if (document.getElementById('maze-svg').style.display !== 'none') {
            // Re-initialize and update the visualization when window is resized
            initMazeVisualization();
            
            // Redraw all nodes based on current path
            const pathLength = userPath ? userPath.length : 0;
            for (let i = 2; i <= pathLength; i++) {
                updateMazeVisualization();
            }
        }
    });

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
