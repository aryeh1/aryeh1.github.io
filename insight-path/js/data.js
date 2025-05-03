// Contains all static data for the application

const ThoughtMazeData = (function() {
    // Data collections
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

    // מאגר ציטוטים נוספים לשילוב בתוך המסע
    const additionalWisdom = {
        general: [
            "״אל תדין את חברך עד שתגיע למקומו״ - פרקי אבות ב:ד",
            "״על שלושה דברים העולם עומד: על התורה, על העבודה ועל גמילות חסדים״ - פרקי אבות א:ב",
            "״אם אין קמח, אין תורה; אם אין תורה, אין קמח״ - פרקי אבות ג:יז",
            "״לא המדרש עיקר, אלא המעשה״ - פרקי אבות א:יז",
            "״אל תסתכל בקנקן, אלא במה שיש בו״ - פרקי אבות ד:כ",
            "״כל ישראל ערבים זה בזה״ - שבועות לט ע״א"
        ],
        
        faith: [
            "״בכל דרכיך דעהו והוא יישר אורחותיך״ - משלי ג:ו",
            "״שויתי ה׳ לנגדי תמיד״ - תהילים טז:ח",
            "״זה א-לי ואנווהו״ - שמות טו:ב",
            "״אין עוד מלבדו״ - דברים ד:לה"
        ],
        
        relationships: [
            "״ואהבת לרעך כמוך״ - ויקרא יט:יח",
            "״איזהו מכובד? המכבד את הבריות״ - פרקי אבות ד:א",
            "״קנה לך חבר״ - פרקי אבות א:ו",
            "״הוי מקבל את כל האדם בסבר פנים יפות״ - פרקי אבות א:טו"
        ],
        
        personal_growth: [
            "״איזהו חכם? הלומד מכל אדם״ - פרקי אבות ד:א",
            "״איזהו גיבור? הכובש את יצרו״ - פרקי אבות ד:א",
            "״איזהו עשיר? השמח בחלקו״ - פרקי אבות ד:א",
            "״ותשובה ותפילה וצדקה מעבירין את רוע הגזרה״ - מן התפילה"
        ],
        
        balance: [
            "״תפסת מרובה לא תפסת״ - ראש השנה ד ע״ב",
            "״כל המוסיף גורע״ - סנהדרין כט ע״א",
            "״בדרך שאדם רוצה לילך בה, מוליכין אותו״ - מכות י ע״ב",
            "״אם אין אני לי, מי לי? וכשאני לעצמי, מה אני? ואם לא עכשיו, אימתי?״ - פרקי אבות א:יד"
        ],
        
        learning: [
            "״הלומד מחברו פרק אחד או הלכה אחת או פסוק אחד או אפילו אות אחת, צריך לנהוג בו כבוד״ - פרקי אבות ו:ג",
            "״הלומד תורה ואינו מקיימה, נוח לו שלא נברא״ - ירושלמי ברכות א:ב",
            "״חנוך לנער על פי דרכו, גם כי יזקין לא יסור ממנה״ - משלי כב:ו",
            "״הפוך בה והפוך בה, דכולה בה״ - פרקי אבות ה:כב"
        ]
    };

    // פונקציה לבחירת ציטוט רלוונטי לפי קטגוריה
    function getWisdomByCategory(category) {
        const relevantWisdom = additionalWisdom[category] || additionalWisdom.general;
        const randomIndex = Math.floor(Math.random() * relevantWisdom.length);
        return relevantWisdom[randomIndex];
    }

    // Question tree structure
    const questionTree = {
        root: {
            question: "מה מטריד את מחשבתך כרגע?",
            options: [
                {
                    text: "משמעות החיים",
                    next: "meaning_of_life"
                },
                {
                    text: "יחסים בין אישיים",
                    next: "relationships" 
                }
            ]
        },
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
        meaning_of_life: {
            question: "איך אתה תופס את משמעות החיים?",
            options: [
                {
                    text: "משמעות דתית ורוחנית",
                    next: "spiritual_meaning",
                    wisdom: "״לא עליך המלאכה לגמור, ולא אתה בן חורין להבטל ממנה״ - פרקי אבות",
                },
                {
                    text: "משמעות הנוצרת מיצירה ועשייה",
                    next: "creative_meaning",
                    wisdom: "״בצלם אלוקים ברא אותו״ - בראשית א:כז"
                }
            ]
        },
        spiritual_meaning: {
            question: "מה מקור החיבור הרוחני שלך?",
            options: [
                {
                    text: "מסורת וקהילה",
                    next: "tradition",
                    wisdom: "״אם אין אני לי, מי לי? וכשאני לעצמי, מה אני?״ - הלל הזקן"
                },
                {
                    text: "חיפוש אישי והתבוננות",
                    next: "personal_search",
                    wisdom: "״דע את עצמך״ - על פי המסורת היהודית"
                }
            ]
        },
        relationships: {
            question: "איזה היבט ביחסים מעסיק אותך?",
            options: [
                {
                    text: "יחסי משפחה",
                    next: "family",
                    wisdom: "״כבד את אביך ואת אמך״ - שמות כ:יב"
                },
                {
                    text: "חברות וקהילה",
                    next: "friendship",
                    wisdom: "״טובים השניים מן האחד״ - קהלת ד:ט"
                }
            ]
        }
        // יש להוסיף פה עוד שאלות ותשובות המשך
    };

    // שילוב הפונקציה בתהליך בחירת השאלה הבאה
    function getRelevantWisdomForAnswer(answer, questionCategory) {
        // קביעת קטגוריה מתאימה לפי תוכן השאלה
        let category = 'general';
        
        if (questionCategory) {
            if (questionCategory.includes('faith') || questionCategory.includes('belief')) {
                category = 'faith';
            } else if (questionCategory.includes('relationship') || questionCategory.includes('social')) {
                category = 'relationships';
            } else if (questionCategory.includes('growth') || questionCategory.includes('personal')) {
                category = 'personal_growth';
            } else if (questionCategory.includes('balance') || questionCategory.includes('decision')) {
                category = 'balance';
            } else if (questionCategory.includes('learning') || questionCategory.includes('education')) {
                category = 'learning';
            }
        }
        
        return getWisdomByCategory(category);
    }

    // עדכון פונקציית בחירת החכמה בתהליך המסע
    function updateWisdomCollection(selectedOption) {
        if (selectedOption.wisdom) {
            journey.addWisdom(selectedOption.wisdom);
        } else {
            // אם אין חכמה מוגדרת מראש, בחר חכמה רלוונטית מהמאגר המורחב
            const questionCategory = journey.currentNode;
            const randomWisdom = getRelevantWisdomForAnswer(selectedOption.text, questionCategory);
            journey.addWisdom(randomWisdom);
        }
    }

    // Public API
    return {
        getQuotes: () => philosophicalQuotes,
        getWisdom: () => jewishWisdom,
        getQuestionTree: () => questionTree,
        getRandomWisdom: () => jewishWisdom[Math.floor(Math.random() * jewishWisdom.length)]
    };
})();