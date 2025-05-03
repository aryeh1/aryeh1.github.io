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

    // Question tree structure
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
        // יש להוסיף פה עוד שאלות ותשובות המשך
    };

    // Public API
    return {
        getQuotes: () => philosophicalQuotes,
        getWisdom: () => jewishWisdom,
        getQuestionTree: () => questionTree,
        getRandomWisdom: () => jewishWisdom[Math.floor(Math.random() * jewishWisdom.length)]
    };
})();