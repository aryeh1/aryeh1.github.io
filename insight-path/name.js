document.addEventListener('DOMContentLoaded', function() {
    // מערכי תוכן מורחבים
    const philosophicalQuotes = [
        { text: "דע את עצמך", source: "סוקרטס" },
        { text: "אני חושב משמע אני קיים", source: "רנה דקארט" },
        { text: "האדם הוא תבנית נוף מולדתו", source: "ש. טשרניחובסקי" },
        { text: "כל אדם צריך שתהיינה לו שתי כיסים. באחד פתק: 'בשבילי נברא העולם', ובשני: 'ואנכי עפר ואפר'", source: "רבי שמחה בונים מפשיסחא" },
        { text: "אל תשפוט יום לפי הקציר שאספת, אלא לפי הזרעים שזרעת", source: "רוברט לואיס סטיבנסון" },
        { text: "חיים שלא נבחנו אינם ראויים לחיות בהם", source: "סוקרטס" },
        { text: "החיים הם מה שקורה לך בזמן שאתה עסוק בתכנון תכניות אחרות", source: "ג'ון לנון" }
    ];

    const jewishWisdom = [
        { text: "אם אין אני לי, מי לי? וכשאני לעצמי, מה אני? ואם לא עכשיו, אימתי?", source: "הלל הזקן, אבות א', י\"ד" },
        { text: "איזהו חכם? הרואה את הנולד", source: "מסכת תמיד" },
        { text: "הוי דן כל אדם לכף זכות", source: "פרקי אבות א', ו'" },
        { text: "לא עליך המלאכה לגמור, ולא אתה בן חורין להיבטל ממנה", source: "פרקי אבות ב', ט\"ז" },
        { text: "דע מאין באת ולאן אתה הולך", source: "פרקי אבות ג', א'" },
        { text: "עשה לך רב, וקנה לך חבר, והוי דן את כל האדם לכף זכות", source: "פרקי אבות א', ו'" },
        { text: "על שלושה דברים העולם עומד: על התורה, על העבודה, ועל גמילות חסדים", source: "פרקי אבות א', ב'" },
        { text: "איזהו עשיר? השמח בחלקו", source: "פרקי אבות ד', א'" }
    ];

    // מבנה נתונים מורחב למבוך המחשבות
    const questionTree = {
        // שאלת פתיחה: משמעות החיים
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
        "connection_family": {
            question: "במה באה לידי ביטוי משמעות הקשר המשפחתי עבורך?",
            context: "המשפחה היא המעגל הקרוב ביותר שלנו, אך לכל אדם היא מהווה משהו אחר.",
            quote: jewishWisdom[4],
            choices: [
                {
                    text: "העברת מסורת ומורשת לדורות הבאים",
                    next: "family_tradition"
                },
                {
                    text: "תמיכה הדדית ותחושת שייכות",
                    next: "family_support"
                },
                {
                    text: "יצירת זכרונות ורגעים משותפים",
                    next: "family_memories"
                }
            ]
        },
        "family_tradition": {
            question: "איזו מורשת תרצה להעביר הלאה?",
            context: "המסורת מחברת בין הדורות ונותנת לנו תחושת המשכיות היסטורית.",
            quote: jewishWisdom[6],
            choices: [
                {
                    text: "ערכים ואמונות",
                    next: "tradition_values" 
                },
                {
                    text: "מנהגים ומסורות משפחתיות",
                    next: "tradition_customs"
                }
            ]
        },
        "tradition_values": {
            question: "אילו ערכים אתה רואה כחיוניים להעברה לדורות הבאים?",
            context: "ערכים הם הבסיס המוסרי שמנחה את חיינו והחלטותינו.",
            quote: jewishWisdom[7],
            choices: [
                {
                    text: "המשך לחקור",
                    next: "summary"
                }
            ]
        },
        "tradition_customs": {
            question: "אילו מנהגים משפחתיים משקפים את הזהות העמוקה ביותר שלך?",
            context: "מנהגים מחברים אותנו אל העבר ונותנים משמעות לרגעים יומיומיים.",
            quote: philosophicalQuotes[2],
            choices: [
                {
                    text: "המשך לחקור",
                    next: "summary"
                }
            ]
        },
        "family_support": {
            question: "כיצד תמיכה משפחתית משפיעה על תחושת המשמעות בחייך?",
            context: "רשת ביטחון משפחתית מאפשרת לנו לצמוח ולהתפתח.",
            quote: jewishWisdom[3],
            choices: [
                {
                    text: "המשך לחקור",
                    next: "summary"
                }
            ]
        },
        "family_memories": {
            question: "מהם הזכרונות המשפחתיים שיוצרים אצלך תחושת משמעות עמוקה?",
            context: "זכרונות הם הסיפורים שאנחנו מספרים לעצמנו על מי אנחנו.",
            quote: philosophicalQuotes[6],
            choices: [
                {
                    text: "המשך לחקור",
                    next: "summary"
                }
            ]
        },
        "connection_friends": {
            question: "מדוע חברויות נותנות לך תחושת משמעות בחיים?",
            context: "חברות אמיתית היא אחת מצורות הקשר האנושי העמוקות ביותר.",
            quote: jewishWisdom[5],
            choices: [
                {
                    text: "הן מאפשרות לי להיות אני האמיתי",
                    next: "friends_authentic"
                },
                {
                    text: "הן מרחיבות את הפרספקטיבה שלי על העולם",
                    next: "friends_perspective"
                }
            ]
        },
        "friends_authentic": {
            question: "כיצד החברים הקרובים לך עוזרים לך להיות האני האמיתי שלך?",
            context: "לפעמים אחרים רואים בנו דברים שאנחנו עצמנו מתקשים לראות.",
            quote: philosophicalQuotes[0],
            choices: [
                {
                    text: "המשך לחקור",
                    next: "summary"
                }
            ]
        },
        "friends_perspective": {
            question: "איזו פרספקטיבה חדשה קיבלת לאחרונה מחבר?",
            context: "דרך עיניהם של אחרים אנו יכולים לראות את העולם בדרכים חדשות.",
            quote: jewishWisdom[2],
            choices: [
                {
                    text: "המשך לחקור",
                    next: "summary"
                }
            ]
        },
        "connection_community": {
            question: "מהי הדרך בה אתה מרגיש שאתה תורם הכי הרבה לקהילה?",
            context: "תרומה לקהילה מחברת אותנו למשהו גדול מאיתנו.",
            quote: jewishWisdom[6],
            choices: [
                {
                    text: "שיתוף הידע והכישרונות שלי",
                    next: "community_knowledge"
                },
                {
                    text: "עזרה לאחרים ותמיכה במי שצריך",
                    next: "community_help"
                }
            ]
        },
        "community_knowledge": {
            question: "איזה ידע או כישרון שלך יכול להועיל ביותר לאחרים?",
            context: "לכל אדם יש מתנה ייחודית שאותה הוא יכול להעניק לעולם.",
            quote: jewishWisdom[3],
            choices: [
                {
                    text: "המשך לחקור",
                    next: "summary"
                }
            ]
        },
        "community_help": {
            question: "כיצד עזרה לאחרים מעניקה משמעות לחייך?",
            context: "חז\"ל אמרו: \"יותר ממה שבעל הבית עושה עם העני, העני עושה עם בעל הבית\".",
            quote: jewishWisdom[6],
            choices: [
                {
                    text: "המשך לחקור",
                    next: "summary"
                }
            ]
        },
        
        // שאלת פתיחה: הגשמה עצמית
        "meaning_growth": {
            question: "מהי הצמיחה האישית המשמעותית ביותר עבורך?",
            context: "הגשמה עצמית יכולה להתבטא בדרכים שונות בחיינו.",
            quote: philosophicalQuotes[5],
            choices: [
                {
                    text: "צמיחה אינטלקטואלית והרחבת הידע",
                    next: "growth_intellectual"
                },
                {
                    text: "פיתוח כישרונות ויכולות אישיות",
                    next: "growth_talent"
                },
                {
                    text: "עבודה על האישיות והמידות",
                    next: "growth_character"
                }
            ]
        },
        "growth_intellectual": {
            question: "איזה תחום ידע אתה הכי להוט ללמוד ולהעמיק בו?",
            context: "הרחבת הידע היא אחת הדרכים העמוקות לצמיחה אישית.",
            quote: philosophicalQuotes[1],
            choices: [
                {
                    text: "המשך לחקור",
                    next: "summary"
                }
            ]
        },
        "growth_talent": {
            question: "איזה כישרון או יכולת שלך היית רוצה לפתח לרמה גבוהה יותר?",
            context: "פיתוח כישרונות מאפשר לנו לבטא את הייחודיות שלנו בעולם.",
            quote: philosophicalQuotes[4],
            choices: [
                {
                    text: "המשך לחקור",
                    next: "summary"
                }
            ]
        },
        "growth_character": {
            question: "איזו תכונת אופי היית רוצה לחזק או לשפר בעצמך?",
            context: "העבודה על המידות היא אחת העבודות החשובות והמאתגרות ביותר.",
            quote: jewishWisdom[2],
            choices: [
                {
                    text: "המשך לחקור",
                    next: "summary"
                }
            ]
        },
        
        // שאלת פתיחה: רוחניות
        "meaning_spiritual": {
            question: "איזה היבט של רוחניות מעניק לחייך את המשמעות העמוקה ביותר?",
            context: "הממד הרוחני מחבר אותנו אל מה שמעבר לחיים היומיומיים.",
            quote: jewishWisdom[4],
            choices: [
                {
                    text: "חיבור למסורת ולמורשת רוחנית",
                    next: "spiritual_tradition"
                },
                {
                    text: "חוויות רוחניות אישיות והתבוננות פנימית",
                    next: "spiritual_personal"
                },
                {
                    text: "חיפוש אחר תשובות לשאלות הגדולות של החיים",
                    next: "spiritual_questions"
                }
            ]
        },
        "spiritual_tradition": {
            question: "איזה חלק במסורת הרוחנית שלך מדבר אליך במיוחד?",
            context: "מסורות רוחניות נושאות חכמה של דורות רבים.",
            quote: jewishWisdom[6],
            choices: [
                {
                    text: "המשך לחקור",
                    next: "summary"
                }
            ]
        },
        "spiritual_personal": {
            question: "איזו חוויה רוחנית השפיעה עליך עמוקות?",
            context: "לעתים רגעים של תובנה או התעלות משנים את תפיסת העולם שלנו.",
            quote: philosophicalQuotes[5],
            choices: [
                {
                    text: "המשך לחקור",
                    next: "summary"
                }
            ]
        },
        "spiritual_questions": {
            question: "איזו שאלה קיומית מעסיקה אותך במיוחד?",
            context: "השאלות הגדולות הן לעתים חשובות יותר מהתשובות.",
            quote: philosophicalQuotes[5],
            choices: [
                {
                    text: "המשך לחקור",
                    next: "summary"
                }
            ]
        },
        
        // שאלת פתיחה: אושר
        "happiness": {
            question: "מהו האושר האמיתי בעיניך?",
            context: "האושר הוא אחד היעדים העתיקים ביותר של החיים האנושיים.",
            quote: jewishWisdom[7],
            choices: [
                {
                    text: "אושר הוא רגעים של שמחה ועונג",
                    next: "happiness_pleasure"
                },
                {
                    text: "אושר הוא שלווה פנימית וסיפוק",
                    next: "happiness_peace"
                },
                {
                    text: "אושר הוא חיים בעלי משמעות והגשמה",
                    next: "happiness_purpose"
                }
            ]
        },
        "happiness_pleasure": {
            question: "אילו חוויות גורמות לך לאושר הגדול ביותר?",
            context: "רגעי אושר אינטנסיביים יכולים להאיר את חיינו.",
            choices: [
                {
                    text: "המשך לחקור",
                    next: "summary"
                }
            ]
        },
        "happiness_peace": {
            question: "מה מביא לך שלווה פנימית אמיתית?",
            context: "השלווה הפנימית היא מצב של שקט נפשי עמוק.",
            quote: jewishWisdom[7],
            choices: [
                {
                    text: "המשך לחקור",
                    next: "summary"
                }
            ]
        },
        "happiness_purpose": {
            question: "כיצד הגשמת המטרות שלך תורמת לאושרך?",
            context: "לעתים האושר נמצא בדרך, לא רק ביעד.",
            quote: philosophicalQuotes[4],
            choices: [
                {
                    text: "המשך לחקור",
                    next: "summary"
                }
            ]
        },
        
        // שאלת פתיחה: תכלית
        "purpose": {
            question: "מהי תכלית הקיום שלך בעולם?",
            context: "מציאת תכלית היא אחד האתגרים העמוקים ביותר של החיים.",
            quote: jewishWisdom[4],
            choices: [
                {
                    text: "להשאיר את העולם מקום טוב יותר",
                    next: "purpose_impact"
                },
                {
                    text: "לחיות חיים מלאים ואותנטיים",
                    next: "purpose_authentic"
                },
                {
                    text: "למלא את הייעוד הייחודי שלי",
                    next: "purpose_unique"
                }
            ]
        },
        "purpose_impact": {
            question: "באיזה אופן היית רוצה להשפיע על העולם?",
            context: "השפעה חיובית יכולה להיות בקנה מידה גדול או קטן.",
            quote: jewishWisdom[3],
            choices: [
                {
                    text: "המשך לחקור",
                    next: "summary"
                }
            ]
        },
        "purpose_authentic": {
            question: "מה פירוש עבורך לחיות חיים אותנטיים?",
            context: "אותנטיות דורשת כנות עם עצמנו ועם העולם.",
            quote: philosophicalQuotes[0],
            choices: [
                {
                    text: "המשך לחקור",
                    next: "summary"
                }
            ]
        },
        "purpose_unique": {
            question: "מה אתה מרגיש שהוא הייעוד הייחודי שלך?",
            context: "לכל אדם יש תפקיד ייחודי שרק הוא יכול למלא.",
            quote: jewishWisdom[0],
            choices: [
                {
                    text: "המשך לחקור",
                    next: "summary"
                }
            ]
        }
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
                { 
                    text: "רגש חיובי (שמחה, התרגשות, תקווה)", 
                    next: "custom_emotion_positive"
                },
                { 
                    text: "רגש מורכב (סקרנות, פליאה, השתאות)", 
                    next: "custom_emotion_complex"
                },
                { 
                    text: "רגש מאתגר (חשש, דאגה, בלבול)", 
                    next: "custom_emotion_challenging"
                }
            ]
        };

        questionTree["custom_emotion_positive"] = {
            question: "כיצד הרגש החיובי הזה משפיע על התשובה שאתה מחפש?",
            context: "רגשות חיוביים יכולים להרחיב את תפיסת העולם שלנו ולפתוח אפשרויות חדשות.",
            quote: philosophicalQuotes[6],
            choices: [
                { text: "המשך לחקור", next: "summary" }
            ]
        };

        questionTree["custom_emotion_complex"] = {
            question: "מה המורכבות של הרגש הזה מלמדת אותך על השאלה?",
            context: "רגשות מורכבים משקפים לעיתים קרובות את העומק של השאלות שאנו שואלים.",
            quote: philosophicalQuotes[5],
            choices: [
                { text: "המשך לחקור", next: "summary" }
            ]
        };

        questionTree["custom_emotion_challenging"] = {
            question: "מה החשש או הדאגה הזו מגלים לך על עצמך?",
            context: "לעיתים דווקא הרגשות המאתגרים מובילים לתובנות העמוקות ביותר.",
            quote: jewishWisdom[4],
            choices: [
                { text: "המשך לחקור", next: "summary" }
            ]
        };

        questionTree["custom_practical"] = {
            question: "איזה צעד מעשי היית רוצה לקחת בהקשר של " + question + "?",
            context: "מחשבה ללא מעשה היא כמו ציפור ללא כנפיים.",
            quote: jewishWisdom[3],
            choices: [
                { text: "המשך לחקור", next: "summary" }
            ]
        };

        questionTree["custom_philosophical"] = {
            question: "איזו הנחת יסוד מסתתרת מאחורי השאלה " + question + "?",
            context: "לעיתים קרובות, השאלות שאנחנו שואלים מבוססות על הנחות סמויות.",
            quote: philosophicalQuotes[1],
            choices: [
                { text: "המשך לחקור", next: "summary" }
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
        const svg = d3.select('#maze-svg');
        svg.selectAll("*").remove();

        // יצירת נקודה ראשונית במרכז עם אנימציה
        svg.append("circle")
            .attr("cx", 500)
            .attr("cy", 200)
            .attr("r", 0)
            .attr("fill", "#3a6ea5")
            .transition()
            .duration(1000)
            .attr("r", 20);

        svg.append("text")
            .attr("x", 500)
            .attr("y", 200)
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .attr("fill", "white")
            .text("התחלה")
            .style("opacity", 0)
            .transition()
            .duration(1000)
            .style("opacity", 1);
    }

    function updateMazeVisualization() {
        // עדכון מבוך הוויזואליזציה כאשר משתמש מתקדם
        const svg = d3.select('#maze-svg');
        
        // הוספת נקודה חדשה בכל בחירה עם אנימציה
        const pathLength = userPath.length;
        
        // קואורדינטות לנקודה החדשה
        const newX = 500 + (pathLength - 1) * 80 * Math.cos(pathLength * 0.7);
        const newY = 200 + (pathLength - 1) * 60 * Math.sin(pathLength * 0.7);
        
        // קואורדינטות לנקודה הקודמת
        const prevX = 500 + (pathLength - 2) * 80 * Math.cos((pathLength-1) * 0.7);
        const prevY = 200 + (pathLength - 2) * 60 * Math.sin((pathLength-1) * 0.7);

        // הוספת קו מחבר עם אנימציה
        svg.append("line")
            .attr("x1", prevX)
            .attr("y1", prevY)
            .attr("x2", prevX)
            .attr("y2", prevY)
            .attr("stroke", "#6b7a8f")
            .attr("stroke-width", 2)
            .transition()
            .duration(800)
            .attr("x2", newX)
            .attr("y2", newY);
            
        // הוספת הנקודה החדשה עם אנימציה
        svg.append("circle")
            .attr("cx", newX)
            .attr("cy", newY)
            .attr("r", 0)
            .attr("fill", "#c0b283")
            .transition()
            .duration(500)
            .delay(800)
            .attr("r", 15);

        // הוספת טקסט קצר לנקודה
        svg.append("text")
            .attr("x", newX)
            .attr("y", newY - 25)
            .attr("text-anchor", "middle")
            .attr("fill", "#373737")
            .style("font-size", "12px")
            .style("opacity", 0)
            .text(userPath[pathLength-1].question.substring(0, 15) + "...")
            .transition()
            .duration(500)
            .delay(1100)
            .style("opacity", 1);
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

        // הוספת תובנות סיכום מותאמות אישית
        const firstQuestion = userPath[0].question;
        let summaryInsight = "";
        
        if (firstQuestion.includes("משמעות החיים")) {
            summaryInsight = "חיפוש המשמעות הוא מסע שנמשך לאורך כל החיים. התשובות שבחרת משקפות את הערכים העמוקים שלך ואת מה שנותן לחייך תכלית.";
        } else if (firstQuestion.includes("אושר")) {
            summaryInsight = "האושר האמיתי אינו רק רגע חולף של הנאה, אלא דרך חיים המבוססת על הבחירות שאנו עושים. הבחירות שלך משקפות את תפיסת האושר האישית שלך.";
        } else if (firstQuestion.includes("תכלית")) {
            summaryInsight = "מציאת תכלית היא אחד האתגרים המשמעותיים ביותר בחיים. המסע שעברת מאיר זוויות שונות של השאלה מהי תכלית הקיום האנושי.";
        } else {
            summaryInsight = "השאלות שבחרת לחקור משקפות את הנושאים העמוקים שמעסיקים אותך. המשך להתבונן ולחקור, והתשובות יתגלו בהדרגה.";
        }

        bookContent += `
            <h4>ניתוח מסכם:</h4>
            <p>${summaryInsight}</p>
            <p>המשך לשאול שאלות ולחפש תשובות. כפי שאמרו חז"ל: "הוי מתלמידי אהרן, אוהב שלום ורודף שלום, אוהב את הבריות ומקרבן לתורה".</p>
        `;

        wisdomBook.innerHTML = bookContent;

        // כפתורי סיום
        document.getElementById('restart').addEventListener('click', function() {
            location.reload();
        });

        document.getElementById('download-pdf').addEventListener('click', function() {
            alert('פונקציונליות זו תתווסף בהמשך - יצירת PDF מספר החכמה שלך');
            // בגרסה עתידית: הטמעת jsPDF
            // import { jsPDF } from "jspdf";
            // const doc = new jsPDF();
            // doc.text(wisdomBook.innerText, 10, 10);
            // doc.save("ספר-החכמה-שלי.pdf");
        });
    }
});