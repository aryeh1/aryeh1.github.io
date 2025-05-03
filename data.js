// data.js - נתוני מבוך המחשבות

const ThoughtMazeData = (function() {
    // ציטוטים פילוסופיים
    const philosophicalQuotes = [
        { text: "דע את עצמך", source: "סוקרטס" },
        { text: "אני חושב משמע אני קיים", source: "רנה דקארט" },
        { text: "האדם הוא תבנית נוף מולדתו", source: "ש. טשרניחובסקי" },
        { text: "כל אדם צריך שתהיינה לו שתי כיסים. באחד פתק: 'בשבילי נברא העולם', ובשני: 'ואנכי עפר ואפר'", source: "רבי שמחה בונים מפשיסחא" }
    ];

    // חוכמה יהודית
    const jewishWisdom = [
        { text: "אם אין אני לי, מי לי? וכשאני לעצמי, מה אני? ואם לא עכשיו, אימתי?", source: "הלל הזקן, אבות א', י\"ד" },
        { text: "איזהו חכם? הרואה את הנולד", source: "מסכת תמיד" },
        { text: "הוי דן כל אדם לכף זכות", source: "פרקי אבות א', ו'" },
        { text: "לא עליך המלאכה לגמור, ולא אתה בן חורין להיבטל ממנה", source: "פרקי אבות ב', ט\"ז" }
    ];

    // שאלות התחלה
    const startingQuestions = [
        { key: "meaning", text: "מהי משמעות החיים?" },
        { key: "happiness", text: "מהו אושר אמיתי?" },
        { key: "justice", text: "מהו צדק?" },
        { key: "knowledge", text: "כיצד אנחנו יודעים מה שאנחנו יודעים?" }
    ];

    // עץ השאלות
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
                    next: "meaning_family"
                },
                {
                    text: "חברויות עמוקות ומשמעותיות",
                    next: "meaning_friends"
                },
                {
                    text: "תרומה לקהילה והשפעה חברתית",
                    next: "meaning_community"
                }
            ]
        },
        "meaning_family": {
            question: "מה הדבר הכי מרגש בקשרים משפחתיים עבורך?",
            context: "משפחה יכולה להיות מקור לכוח, אתגר, ואהבה בלתי מותנית.",
            quote: jewishWisdom[0],
            choices: [
                {
                    text: "המשך מסע",
                    next: "summary"
                }
            ]
        },
        "meaning_friends": {
            question: "איך חברויות עמוקות משנות אותך?",
            context: "החברויות שלנו לעיתים מגדירות מי אנחנו ולאן אנחנו הולכים.",
            quote: philosophicalQuotes[2],
            choices: [
                {
                    text: "המשך מסע",
                    next: "summary"
                }
            ]
        },
        "meaning_community": {
            question: "איזו השפעה אתה מקווה להשאיר על הקהילה שלך?",
            context: "תרומה לקהילה יכולה להעניק תחושה עמוקה של תכלית.",
            quote: jewishWisdom[3],
            choices: [
                {
                    text: "המשך מסע",
                    next: "summary"
                }
            ]
        },
        "meaning_growth": {
            question: "איזה סוג של צמיחה מרגיש לך הכי משמעותי?",
            context: "התפתחות עצמית יכולה לבוא בהרבה צורות - רגשית, אינטלקטואלית, מקצועית...",
            quote: philosophicalQuotes[1],
            choices: [
                {
                    text: "צמיחה רגשית ומודעות עצמית",
                    next: "summary"
                },
                {
                    text: "למידה מתמדת וחוכמה",
                    next: "summary"
                },
                {
                    text: "יצירתיות והבעה עצמית",
                    next: "summary"
                }
            ]
        },
        "meaning_spiritual": {
            question: "איך אתה מתחבר לרוחניות בחיים?",
            context: "רוחניות יכולה להימצא בדת מסורתית, בטבע, באומנות, ובחוויות עמוקות אחרות.",
            quote: jewishWisdom[1],
            choices: [
                {
                    text: "דרך מסורת דתית",
                    next: "summary"
                },
                {
                    text: "דרך הטבע ויצירה אמנותית",
                    next: "summary"
                },
                {
                    text: "דרך מדיטציה והתבודדות",
                    next: "summary"
                }
            ]
        },
        "happiness": {
            question: "מהו אושר אמיתי בעיניך?",
            context: "אושר הוא מושג מורכב ושונה לכל אחד.",
            quote: philosophicalQuotes[3],
            choices: [
                {
                    text: "זה מרגש שקט פנימי",
                    next: "summary"
                },
                {
                    text: "זה בהגשמת חלומות ויעדים",
                    next: "summary"
                },
                {
                    text: "זה בחוויות ולהיות מקבל אתגרים",
                    next: "summary"
                }
            ]
        },
        "justice": {
            question: "איך אתה מגדיר צדק?",
            context: "מושג הצדק היה במרכז הפילוסופיה מאז אפלטון.",
            quote: jewishWisdom[2],
            choices: [
                {
                    text: "שוויון לכל אדם",
                    next: "summary"
                },
                {
                    text: "פרופורציונליות - כל אחד מקבל על פי מעשיו",
                    next: "summary"
                },
                {
                    text: "רחמים ונתינת מקום לחזרה בתשובה",
                    next: "summary"
                }
            ]
        },
        "knowledge": {
            question: "כיצד אנחנו יכולים לדעת שאנחנו יודעים משהו?",
            context: "שאלה משמעותית באפיסטמולוגיה - הפילוסופיה של הידע.",
            quote: philosophicalQuotes[1],
            choices: [
                {
                    text: "דרך ההיגיון והראיה",
                    next: "summary"
                },
                {
                    text: "דרך החושים והניסיון",
                    next: "summary"
                },
                {
                    text: "דרך האמונה והביטחון הפנימי",
                    next: "summary"
                }
            ]
        },
        "custom": {
            question: "",
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
        },
        "custom_emotional": {
            question: "מה הרגש העיקרי שעולה בך?",
            context: "רגשות הם מפתח להבנת עצמנו ומניעינו העמוקים.",
            quote: jewishWisdom[2],
            choices: [
                { text: "המשך לשאלה הבאה", next: "summary" }
            ]
        },
        "custom_practical": {
            question: "מה הפעולה הראשונה שתרצה לעשות?",
            context: "מעבר מחשיבה לפעולה הוא מפתח לשינוי אמיתי.",
            quote: philosophicalQuotes[2],
            choices: [
                { text: "המשך לשאלה הבאה", next: "summary" }
            ]
        },
        "custom_philosophical": {
            question: "איך זה משתלב בתפיסת העולם שלך?",
            context: "השקפת העולם שלנו מעצבת איך אנחנו רואים את המציאות.",
            quote: philosophicalQuotes[3],
            choices: [
                { text: "המשך לשאלה הבאה", next: "summary" }
            ]
        }
    };

    // API ציבורי
    return {
        getQuotes: () => philosophicalQuotes,
        getWisdom: () => jewishWisdom,
        getStartingQuestions: () => startingQuestions,
        getQuestionTree: () => questionTree,
        getRandomWisdom: () => jewishWisdom[Math.floor(Math.random() * jewishWisdom.length)]
    };
})();
