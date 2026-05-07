import type { Yeshiva, Board } from './types';

/**
 * The yeshivot referenced from people.ts. A person is "of" a yeshiva
 * via a `PersonYeshivaRole` entry. The accent color is used to tint
 * node borders, never the entire node fill.
 */
export const yeshivot: Yeshiva[] = [
  // === The Slabodka chain ===
  { id: 'slabodka-kovno', name: 'ישיבת כנסת ישראל סלבודקא (קובנה)', shortName: 'סלבודקא קובנה', location: 'סלבודקא, ליטא', founded: 1881, accent: '#8B2635' },
  { id: 'slabodka-bb', name: 'ישיבת כנסת ישראל סלבודקא בני ברק', shortName: 'סלבודקא ב"ב', location: 'בני ברק', founded: 1947, accent: '#8B2635' },
  { id: 'hebron', name: 'ישיבת חברון "כנסת ישראל"', shortName: 'חברון', location: 'ירושלים (במקור: חברון)', founded: 1924, accent: '#A33545' },
  { id: 'mir-eu', name: 'ישיבת מיר ליטא', shortName: 'מיר (ליטא)', location: 'מיר, ליטא', founded: 1817 },
  { id: 'mir-jlm', name: 'ישיבת מיר ירושלים', shortName: 'מיר ירושלים', location: 'ירושלים', founded: 1944, accent: '#1D4E89' },
  { id: 'mir-brachfeld', name: 'ישיבת מיר ברכפלד', shortName: 'מיר ברכפלד', location: 'מודיעין עילית', founded: 1996, accent: '#2A6BB0' },
  { id: 'mir-bk', name: 'ישיבת מיר ברוקלין', shortName: 'מיר ברוקלין', location: 'ברוקלין, ניו יורק', founded: 1947 },
  { id: 'mir-shanghai', name: 'ישיבת מיר בשנגחאי', shortName: 'מיר שנגחאי', location: 'שנגחאי', founded: 1941 },

  // === Lakewood / Lithuanian USA ===
  { id: 'kletzk', name: 'ישיבת עץ חיים קלצק', shortName: 'קלצק', location: 'קלצק, פולין', founded: 1897 },
  { id: 'lakewood', name: 'בית מדרש גבוה (ליקווד)', shortName: 'ליקווד', location: 'ליקווד, ניו ג\'רזי', founded: 1943, accent: '#0E5E2C' },
  { id: 'philadelphia', name: 'ישיבת פילדלפיה', shortName: 'פילדלפיה', location: 'פילדלפיה, פנסילבניה', founded: 1953 },
  { id: 'torah-vodaath', name: 'ישיבת תורה ודעת', shortName: 'תורה ודעת', location: 'ברוקלין, ניו יורק', founded: 1918 },
  { id: 'beis-medrash-elyon', name: 'בית מדרש עליון מונסי', shortName: 'ב"מ עליון', location: 'מונסי, ניו יורק', founded: 1943 },
  { id: 'chaim-berlin', name: 'ישיבת רבנו חיים ברלין', shortName: 'חיים ברלין', location: 'ברוקלין, ניו יורק', founded: 1907 },
  { id: 'pachad-yitzchak', name: 'ישיבת פחד יצחק', shortName: 'פחד יצחק', location: 'ירושלים', founded: 1980 },
  { id: 'ner-israel', name: 'ישיבת נר ישראל בולטימור', shortName: 'נר ישראל', location: 'בולטימור', founded: 1933 },
  { id: 'mtj', name: 'ישיבת תפארת ירושלים (MTJ)', shortName: 'MTJ', location: 'מנהטן, ניו יורק', founded: 1907 },
  { id: 'telz-lita', name: 'ישיבת טלז ליטא', shortName: 'טלז (ליטא)', location: 'טלז, ליטא', founded: 1875 },
  { id: 'telz-cleveland', name: 'ישיבת טלז קליבלנד', shortName: 'טלז קליבלנד', location: 'קליבלנד, אוהיו', founded: 1941 },

  // === Ponevezh / Israel core ===
  { id: 'ponevezh-eu', name: 'ישיבת פוניבז\' ליטא', shortName: 'פוניבז\' (ליטא)', location: 'פוניבז\', ליטא', founded: 1908 },
  { id: 'ponevezh', name: 'ישיבת פוניבז\'', shortName: 'פוניבז\'', location: 'בני ברק', founded: 1944, accent: '#7A4F2E' },
  { id: 'ponevezh-letzeirim', name: 'ישיבת פוניבז\' לצעירים', shortName: 'פוניבז\' לצעירים', location: 'בני ברק' },
  { id: 'kol-torah', name: 'ישיבת קול תורה', shortName: 'קול תורה', location: 'ירושלים', founded: 1939 },
  { id: 'eitz-chaim', name: 'ישיבת עץ חיים', shortName: 'עץ חיים', location: 'ירושלים', founded: 1841 },
  { id: 'kamenitz-jlm', name: 'ישיבת כנסת בית יצחק (קמניץ ירושלים)', shortName: 'קמניץ', location: 'ירושלים', founded: 1945 },
  { id: 'kamenitz-eu', name: 'ישיבת כנסת בית יצחק (קמניץ ליטא)', shortName: 'קמניץ (ליטא)', location: 'קמניץ, פולין' },

  // === Brisk / Soloveitchik ===
  { id: 'volozhin', name: 'ישיבת וולוז\'ין', shortName: 'וולוז\'ין', location: 'וולוז\'ין, ליטא', founded: 1803 },
  { id: 'brisk-jlm', name: 'ישיבת בריסק', shortName: 'בריסק', location: 'ירושלים', founded: 1939 },
  { id: 'brisk-peres', name: 'ישיבת בריסק (רח\' פרס)', shortName: 'בריסק פרס', location: 'ירושלים', founded: 1980 },
  { id: 'yad-halevi', name: 'ישיבת יד הלוי', shortName: 'יד הלוי', location: 'ירושלים', founded: 2006 },

  // === Hebron / Chevron ===
  { id: 'atrat-yisrael', name: 'ישיבת עטרת ישראל', shortName: 'עטרת ישראל', location: 'ירושלים', founded: 1976 },
  { id: 'beer-yaakov', name: 'ישיבת באר יעקב', shortName: 'באר יעקב', location: 'באר יעקב', founded: 1953 },
  { id: 'grodno-by', name: 'ישיבת גרודנא', shortName: 'גרודנא', location: 'באר יעקב/אשדוד' },
  { id: 'or-yisrael', name: 'ישיבת אור ישראל', shortName: 'אור ישראל', location: 'פתח תקווה', founded: 1956 },
  { id: 'tushia', name: 'ישיבת תושיה', shortName: 'תושיה תפרח', location: 'תפרח', founded: 1979 },
  { id: 'rashbi', name: 'ישיבת רשב"י', shortName: 'רשב"י', location: 'בני ברק' },
  { id: 'orchos-torah', name: 'ישיבת אורחות תורה', shortName: 'אורחות תורה', location: 'בני ברק', founded: 2002 },
  { id: 'gaon-yaakov', name: 'ישיבת גאון יעקב', shortName: 'גאון יעקב', location: 'בני ברק' },
  { id: 'maalos-hatorah', name: 'ישיבת מעלות התורה', shortName: 'מעלות התורה', location: 'ירושלים' },
  { id: 'meor-hatalmud', name: 'ישיבת מאור התלמוד', shortName: 'מאור התלמוד', location: 'רחובות' },
  { id: 'atrat-shlomo', name: 'רשת עטרת שלמה', shortName: 'עטרת שלמה', location: 'רחבי הארץ' },
  { id: 'heichal-hatalmud', name: 'ישיבת היכל התלמוד', shortName: 'היכל התלמוד', location: 'תל אביב' },
  { id: 'rad', name: 'ישיבת ראדין', shortName: 'ראדין', location: 'ראדין, פולין' },
  { id: 'novardok', name: 'ישיבת נובהרדוק', shortName: 'נובהרדוק', location: 'נובהרדוק, ליטא' },
  { id: 'kelm', name: 'תלמוד תורה דקלם', shortName: 'קלם', location: 'קלם, ליטא' },
];

export const boards: Board[] = [
  {
    id: 'moetzes-degel',
    name: 'מועצת גדולי התורה של דגל התורה',
    shortName: 'מועצת דגל',
    description:
      'הגוף הרבני העליון של מפלגת דגל התורה. מאז פטירת ר\' גרשון אדלשטיין (סיוון תשפ"ג / 5.2023) ללא נשיא רשמי.',
  },
  {
    id: 'moetzes-aguda-il',
    name: 'מועצת גדולי התורה של אגודת ישראל (ישראל)',
    shortName: 'מועצת אגודה ישראל',
    description: 'בעיקר גוף חסידי, אך בעבר חברו בה גם רבני ליטאי.',
  },
  {
    id: 'moetzes-aguda-us',
    name: 'מועצת גדולי התורה של אגודת ישראל (אמריקה)',
    shortName: 'מועצת אגודה ארה"ב',
    description: 'הגוף הרבני העליון של אגודת ישראל באמריקה. רובם ליטאים.',
  },
  {
    id: 'vaad-yeshivos',
    name: 'ועד הישיבות בארץ ישראל',
    shortName: 'ועד הישיבות',
    description:
      'הגוף המחלק תקציבי משרד החינוך לישיבות (~1.8 מיליארד ש"ח). נשיא: ר\' דב לנדו (מ-2023).',
  },
  {
    id: 'chinuch-atzmai',
    name: 'מרכז החינוך העצמאי',
    shortName: 'חינוך עצמאי',
    description: 'רשת ~285 מוסדות, ~113,000 תלמידים. מנכ"ל: ר\' אליעזר סורוצקין.',
  },
  {
    id: 'pelag',
    name: 'הפלג הירושלמי (הנהגה)',
    shortName: 'פלג ירושלמי',
    description: 'פלג רעיוני שפרש מדגל התורה ב-2012. מנהיג נוכחי: ר\' עזריאל אוירבך.',
  },
  {
    id: 'badatz-bb',
    name: 'בד"ץ "שערי הוראה" בני ברק',
    shortName: 'בד"ץ ב"ב',
    description: 'בית הדין שייסד ר\' ניסים קרליץ ב-1968.',
  },
];
