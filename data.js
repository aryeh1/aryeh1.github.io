// data.js - נתוני מבוך המחשבות המורחב

const ThoughtMazeData = (function() {
    // ציטוטים פילוסופיים מורחבים
    const philosophicalQuotes = [
        { text: "דע את עצמך", source: "סוקרטס" },
        { text: "אני חושב משמע אני קיים", source: "רנה דקארט" },
        { text: "האדם הוא תבנית נוף מולדתו", source: "ש. טשרניחובסקי" },
        { text: "כל אדם צריך שתהיינה לו שתי כיסים. באחד פתק: 'בשבילי נברא העולם', ובשני: 'ואנכי עפר ואפר'", source: "רבי שמחה בונים מפשיסחא" },
        { text: "האדם הוא מבצר הפנימי החזק ביותר והפגיע ביותר", source: "ניטשה" },
        { text: "מי שעושה דבר אחד, עושה הכל", source: "אברהם יהושע השל" },
        { text: "האושר כמו פרפר, ככל שנרדוף אחריו הוא יימלט, אבל אם נשב באיפוק, ייתכן שינוח עלינו", source: "דוד שוגרמן" },
        { text: "אנחנו חיים עם העולם שבנחנו", source: "א.י. פינפר" }
    ];

    // חוכמה יהודית מורחבת
    const jewishWisdom = [
        { text: "אם אין אני לי, מי לי? וכשאני לעצמי, מה אני? ואם לא עכשיו, אימתי?", source: "הלל הזקן, אבות א', י\"ד" },
        { text: "איזהו חכם? הרואה את הנולד", source: "מסכת תמיד" },
        { text: "הוי דן כל אדם לכף זכות", source: "פרקי אבות א', ו'" },
        { text: "לא עליך המלאכה לגמור, ולא אתה בן חורין להיבטל ממנה", source: "פרקי אבות ב', ט\"ז" },
        { text: "בן שלוש למקרא, בן חמש למשנה, בן עשר לגמרא", source: "משנה אבות ה', כ\"א" },
        { text: "הכל צפוי והרשות נתונה", source: "רבי עקיבא" },
        { text: "דרך ארץ קדמה לתורה", source: "ויקרא רבה, ט'" },
        { text: "אמרו חכמים: איזהו עשיר? השמח בחלקו", source: "פרקי אבות, ד'" }
    ];

    // שאלות התחלה מורחבות
    const startingQuestions = [
        { key: "meaning", text: "מהי משמעות החיים?" },
        { key: "happiness", text: "מהו אושר אמיתי?" },
        { key: "justice", text: "מהו צדק?" },
        { key: "knowledge", text: "כיצד אנחנו יודעים מה שאנחנו יודעים?" },
        { key: "time", text: "מה היחס שלי לזמן ולתמותה?" },
        { key: "truth", text: "מהי אמת?" },
        { key: "beauty", text: "מהו יופי?" },
        { key: "freedom", text: "מהי חירות אמיתית?" }
    ];

    // עץ השאלות מורחב
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
                },
                {
                    text: "משמעות החיים היא ביצירה והשארת מורשת",
                    next: "meaning_legacy"
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
                    text: "האהבה הבלתי מותנית",
                    next: "meaning_family_love"
                },
                {
                    text: "המשכיות הדורית",
                    next: "meaning_family_generations"
                },
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
                    text: "הן מראות לי מי אני",
                    next: "meaning_friends_mirror"
                },
                {
                    text: "הן מאפשרות לי להיות אותנטי",
                    next: "meaning_friends_authentic"
                },
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
                    text: "לשפר חיים של מי שנמצאים בקשיים",
                    next: "meaning_community_help"
                },
                {
                    text: "ליצור מרחבי מפגש ובנייה",
                    next: "meaning_community_build"
                },
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
                    next: "meaning_growth_emotional"
                },
                {
                    text: "למידה מתמדת וחוכמה",
                    next: "meaning_growth_wisdom"
                },
                {
                    text: "יצירתיות והבעה עצמית",
                    next: "meaning_growth_creative"
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
                    next: "meaning_spiritual_religious"
                },
                {
                    text: "דרך הטבע ויצירה אמנותית",
                    next: "meaning_spiritual_nature"
                },
                {
                    text: "דרך מדיטציה והתבודדות",
                    next: "meaning_spiritual_meditation"
                }
            ]
        },
        "meaning_legacy": {
            question: "איזו מורשת תרצה להשאיר אחריך?",
            context: "רבים מחפשים משמעות ביצירה או בהשפעה שיישארו אחריהם.",
            quote: philosophicalQuotes[5],
            choices: [
                {
                    text: "חיבורים ועבודה אקדמית",
                    next: "meaning_legacy_academic"
                },
                {
                    text: "יצירות אומנות או כתיבה",
                    next: "meaning_legacy_art"
                },
                {
                    text: "מוסדות או יוזמות חברתיות",
                    next: "meaning_legacy_social"
                }
            ]
        },
        "happiness": {
            question: "מהו אושר אמיתי בעיניך?",
            context: "אושר הוא מושג מורכב ושונה לכל אחד.",
            quote: philosophicalQuotes[6],
            choices: [
                {
                    text: "זה שקט פנימי וכניפה",
                    next: "happiness_peace"
                },
                {
                    text: "זה בהגשמת חלומות ויעדים",
                    next: "happiness_achievement"
                },
                {
                    text: "זה בחוויות ובקבלת אתגרים",
                    next: "happiness_experience"
                },
                {
                    text: "זה בהכרת הטוב ובתודה על הקיים",
                    next: "happiness_gratitude"
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
                    next: "justice_equality"
                },
                {
                    text: "פרופורציונליות - כל אחד מקבל על פי מעשיו",
                    next: "justice_merit"
                },
                {
                    text: "רחמים ונתינת מקום לחזרה בתשובה",
                    next: "justice_forgiveness"
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
                    next: "knowledge_logic"
                },
                {
                    text: "דרך החושים והניסיון",
                    next: "knowledge_experience"
                },
                {
                    text: "דרך האמונה והביטחון הפנימי",
                    next: "knowledge_faith"
                }
            ]
        },
        "time": {
            question: "מה היחס שלך לזמן?",
            context: "זמן הוא אחד הרכיבים הבסיסיים של הקיום האנושי, ועדיין נשאר תעלומה עמוקה.",
            quote: jewishWisdom[6],
            choices: [
                {
                    text: "אני מנסה לחיות בהווה",
                    next: "time_present"
                },
                {
                    text: "אני מתמקד בעתיד ובתכנון",
                    next: "time_future"
                },
                {
                    text: "אני מוצא משמעות בקשר לעבר ולמסורת",
                    next: "time_past"
                }
            ]
        },
        "truth": {
            question: "מהי אמת?",
            context: "חיפוש האמת הוא אחד הניעים הבסיסיים של הפילוסופיה והמדע.",
            quote: philosophicalQuotes[4],
            choices: [
                {
                    text: "אמת היא מה שמתאים למציאות",
                    next: "truth_objective"
                },
                {
                    text: "אמת היא סובייקטיבית לכל אדם",
                    next: "truth_subjective"
                },
                {
                    text: "ישנן אמיתות יחסיות ומוחלטות",
                    next: "truth_relative"
                }
            ]
        },
        "beauty": {
            question: "מהו יופי?",
            context: "השאלה על היופי עוסקת באסתטיקה - באופי האמנות והיצירה.",
            quote: philosophicalQuotes[7],
            choices: [
                {
                    text: "יופי נמצא בטבע ובפשטות",
                    next: "beauty_nature"
                },
                {
                    text: "יופי הוא ביצירות אמנות אנושיות",
                    next: "beauty_art"
                },
                {
                    text: "יופי הוא ברגעים ובחוויות",
                    next: "beauty_experience"
                }
            ]
        },
        "freedom": {
            question: "מהי חירות אמיתית?",
            context: "חירות היא ערך מרכזי באנושות, אך גבולותיה וטבעה מעוררים דיונים רבים.",
            quote: jewishWisdom[5],
            choices: [
                {
                    text: "חירות היא יכולת לעשות מה שרוצים",
                    next: "freedom_action"
                },
                {
                    text: "חירות היא חופש מפחדים ואילוצים פנימיים",
                    next: "freedom_inner"
                },
                {
                    text: "חירות היא אחריות לעצמי ולאחרים",
                    next: "freedom_responsibility"
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
                },
                {
                    text: "אני רוצה לחקור את ההיבט הרוחני של השאלה",
                    next: "custom_spiritual"
                }
            ]
        },
        "custom_emotional": {
            question: "מה הרגש העיקרי שעולה בך?",
            context: "רגשות הם מפתח להבנת עצמנו ומניעינו העמוקים.",
            quote: jewishWisdom[2],
            choices: [
                { text: "המשך לחקור", next: "custom_emotional_deep" },
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
        },
        "custom_spiritual": {
            question: "איזה קשר רוחני אתה מוצא בשאלה?",
            context: "מימד רוחני יכול להוסיף עומק לכל שאלה שאנחנו חוקרים.",
            quote: jewishWisdom[7],
            choices: [
                { text: "המשך לשאלה הבאה", next: "summary" }
            ]
        },
        "summary": {
            question: "",
            context: "הגענו למחצית הדרך במסע המחשבתי.",
            choices: [
                { text: "המשך למסע פילוסופי נוסף", next: "meaning" },
                { text: "המשך לנושא אחר", next: "" },
                { text: "סיום המסע", next: "end" }
            ]
        },
        "end": {
            question: "תודה שהצטרפת למסע המחשבתי!",
            context: "השאלות שחקרנו יחד הן רק התחלה. המסע האמיתי ממשיך בחיי היומיום שלך.",
            quote: philosophicalQuotes[5],
            choices: []
        }
    };

    // מערך הרהורים
    const reflections = [
        "לפעמים הדרך לתשובה מתחילה בשאלה הנכונה",
        "כל מסע מחשבתי מתחיל בצעד קטן",
        "החכמה היא בידיעה שאין ידיעה מוחלטת",
        "המסע הארוך ביותר הוא אל תוך עצמנו"
    ];

    // API ציבורי מורחב
    return {
        getQuotes: () => philosophicalQuotes,
        getWisdom: () => jewishWisdom,
        getStartingQuestions: () => startingQuestions,
        getQuestionTree: () => questionTree,
        getRandomWisdom: () => jewishWisdom[Math.floor(Math.random() * jewishWisdom.length)],
        getRandomQuote: () => philosophicalQuotes[Math.floor(Math.random() * philosophicalQuotes.length)],
        getRandomReflection: () => reflections[Math.floor(Math.random() * reflections.length)],
        getRelatedQuotes: (theme) => {
            // מציאת ציטוטים קשורים לנושא
            const themeKeywords = {
                'meaning': ['משמעות', 'תכלית', 'חיים'],
                'happiness': ['אושר', 'שמחה', 'הנאה'],
                'wisdom': ['חוכמה', 'ידע', 'הבנה'],
                'community': ['קהילה', 'חברה', 'אחרים']
            };
            
            return philosophicalQuotes.filter(quote => {
                const keywords = themeKeywords[theme] || [];
                return keywords.some(keyword => quote.text.includes(keyword));
            });
        }
    };
})();

// פונקציות עזר
function addCustomQuestion(key, question, context) {
    // הוספת שאלה מותאמת אישית
    const tree = ThoughtMazeData.getQuestionTree();
    if (!tree[key]) {
        tree[key] = {
            question: question,
            context: context,
            choices: [
                {
                    text: "אני רוצה לחקור את ההיבט הרגשי",
                    next: "custom_emotional"
                },
                {
                    text: "אני רוצה לחקור את ההיבט הפרקטי",
                    next: "custom_practical"
                },
                {
                    text: "אני רוצה לחקור את ההיבט הפילוסופי",
                    next: "custom_philosophical"
                }
            ]
        };
    }
}

// דוגמאות לשימוש
// const customQuestion = addCustomQuestion("time_death", "איך אני מתייחס למוות?", "המוות הוא חלק בלתי נפרד מהחיים ומעצב את היחס שלנו לזמן.");
