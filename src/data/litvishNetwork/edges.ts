import type { RelationshipEdge } from './types';

/**
 * Relationship edges among the people in `people.ts`.
 *
 * Convention:
 *  - parent     : biological parent → child
 *  - spouse     : marriage between two people that are both nodes
 *  - inlaw      : father-in-law → son-in-law (shortcut when the
 *                 intermediate daughter is not herself a node)
 *  - teacher    : rebbe → consequential talmid (only the headline
 *                 students who themselves became roshei yeshiva)
 *  - succession : predecessor → successor at a specific yeshiva
 */
const e = (
  source: string,
  target: string,
  type: RelationshipEdge['type'],
  note?: string,
  uncertain = false,
): RelationshipEdge => ({
  id: `${source}--${type}--${target}`,
  source,
  target,
  type,
  ...(note ? { note } : {}),
  ...(uncertain ? { uncertain: true } : {}),
});

export const edges: RelationshipEdge[] = [
  // ====================================================================
  // הסבא — נישואים והורות
  // ====================================================================
  e('sabba-slabodka', 'gitel-wolfert', 'spouse'),
  e('sabba-slabodka', 'eliezer-yehuda-finkel', 'parent', 'בן'),
  e('sabba-slabodka', 'moshe-finkel', 'parent', 'בן'),
  e('sabba-slabodka', 'avraham-shmuel-finkel', 'parent', 'בן'),
  e('sabba-slabodka', 'gutel-finkel', 'parent', 'בת'),
  e('gutel-finkel', 'isaac-sher', 'spouse'),
  e('sabba-slabodka', 'isaac-sher', 'inlaw', 'חתן'),

  // הסבא ורבותיו
  e('sabba-kelm', 'sabba-slabodka', 'teacher'),

  // הסבא מ"מ אפשטיין כחותן בנו
  e('mm-epstein', 'moshe-finkel', 'inlaw', 'חתן'),

  // ====================================================================
  // תלמידי הסבא — דור 1
  // ====================================================================
  e('sabba-slabodka', 'aharon-kotler', 'teacher'),
  e('sabba-slabodka', 'yaakov-kamenetsky', 'teacher'),
  e('sabba-slabodka', 'reuven-grozovsky', 'teacher'),
  e('sabba-slabodka', 'yitzchak-hutner', 'teacher'),
  e('sabba-slabodka', 'yechezkel-sarna', 'teacher'),
  e('sabba-slabodka', 'isaac-sher', 'teacher'),
  e('sabba-slabodka', 'mm-epstein', 'teacher'),
  e('sabba-slabodka', 'ruderman', 'teacher'),
  e('sabba-slabodka', 'naftali-trop', 'teacher'),
  e('sabba-slabodka', 'avraham-grodzinski', 'teacher'),
  e('sabba-slabodka', 'yerucham-levovitz', 'teacher'),
  e('sabba-slabodka', 'yechezkel-levenstein', 'teacher'),
  e('sabba-kelm', 'yerucham-levovitz', 'teacher'),

  // ר' נפתלי טרופ — חתן הסבא
  e('sabba-slabodka', 'naftali-trop', 'inlaw', 'חתן'),

  // ====================================================================
  // קוטלר / מלצר / ליקווד
  // ====================================================================
  e('isser-zalman-meltzer', 'aharon-kotler', 'inlaw', 'חתן (חנה פערל בת מלצר)'),
  e('mm-epstein', 'isser-zalman-meltzer', 'spouse', 'גיסים (אחיות לאשה)'),
  e('aharon-kotler', 'shneur-kotler', 'parent', 'בן'),
  e('shneur-kotler', 'malkiel-kotler', 'parent', 'בן'),
  e('shneur-kotler', 'shustal', 'inlaw', 'חתן'),
  e('aharon-kotler', 'dov-schwartzman', 'inlaw', 'חתן'),
  e('dov-schwartzman', 'olshin', 'inlaw', 'חתן'),
  e('dov-schwartzman', 'neuman', 'inlaw', 'חתן'),
  e('aharon-kotler', 'shneur-kotler', 'succession', 'תשכ"ב — ר"י ליקווד'),
  e('shneur-kotler', 'malkiel-kotler', 'succession', 'תשמ"ב — ר"י ליקווד'),
  e('aharon-kotler', 'wachtfogel', 'teacher'),
  e('wachtfogel', 'eliahu-dov-wachtfogel', 'parent', 'בן'),

  // ====================================================================
  // קמנצקי
  // ====================================================================
  e('yaakov-kamenetsky', 'shmuel-kamenetsky', 'parent', 'בן'),
  e('aharon-kotler', 'shmuel-kamenetsky', 'teacher', 'מינה אותו לפילדלפיה'),

  // ====================================================================
  // הוטנר / חיים ברלין
  // ====================================================================
  e('yitzchak-hutner', 'aharon-schechter', 'teacher'),
  e('yitzchak-hutner', 'yonatan-david', 'inlaw', 'חתן (אשתו ברוריה)'),
  e('yitzchak-hutner', 'aharon-schechter', 'succession', 'ר"י חיים ברלין'),
  e('yitzchak-hutner', 'feldman', 'teacher'),
  e('ruderman', 'feldman', 'teacher'),
  e('ruderman', 'feldman', 'succession', 'נר ישראל'),

  // ====================================================================
  // חברון / סרנא / אפשטיין / חודש
  // ====================================================================
  e('mm-epstein', 'yechezkel-sarna', 'inlaw', 'חתן (פעשה מרים)'),
  e('mm-epstein', 'meir-chodosh', 'inlaw', 'חתן'),
  e('yechezkel-sarna', 'avraham-epstein-hebron', 'inlaw', 'חתן'),
  e('mm-epstein', 'yechezkel-sarna', 'succession', 'תרצ"ד — חברון'),
  e('yechezkel-sarna', 'avraham-epstein-hebron', 'succession', 'תשכ"א — חברון'),
  e('avraham-epstein-hebron', 'mm-perbestein', 'parent', 'בן'),
  e('moshe-finkel', 'shimcha-zissel-broide', 'inlaw', 'חתן (גולדה מרים)'),
  e('mendel-broide', 'shimcha-zissel-broide', 'parent', 'בן'),
  e('meir-chodosh', 'shulamit-mahla', 'parent', 'בת'),
  e('shulamit-mahla', 'baruch-mordechai-ezrachi', 'spouse'),
  e('meir-chodosh', 'baruch-mordechai-ezrachi', 'inlaw', 'חתן'),
  e('meir-chodosh', 'aharon-chodosh', 'parent', 'בן'),
  e('chaim-zev-finkel', 'aharon-chodosh', 'inlaw', 'חתן'),
  e('eliezer-yehuda-finkel', 'chaim-zev-finkel', 'parent', 'בן'),

  // חברון היום
  e('avraham-epstein-hebron', 'mm-perbestein', 'succession', 'חברון'),
  e('tzvi-pesach-frank', 'david-cohen-hebron', 'teacher', 'סבו דרך אם'),

  // ====================================================================
  // מיר / פינקל / שמואלביץ
  // ====================================================================
  e('eliezer-yehuda-finkel', 'binyamin-finkel', 'parent', 'בן'),
  e('eliezer-yehuda-finkel', 'chaim-shmuelevitz', 'inlaw', 'חתן'),
  e('binyamin-finkel', 'nosson-tzvi-finkel', 'inlaw', 'חתן (לאה בת בנימין)'),
  e('chaim-zev-finkel', 'nosson-tzvi-finkel', 'parent', 'בן'),
  e('eliezer-yehuda-finkel', 'binyamin-finkel', 'succession', 'תשכ"ה — מיר'),
  e('binyamin-finkel', 'nosson-tzvi-finkel', 'succession', 'תש"ן — מיר'),
  e('nosson-tzvi-finkel', 'eliezer-yehuda-finkel-2', 'parent', 'בן'),
  e('nosson-tzvi-finkel', 'eliezer-yehuda-finkel-2', 'succession', 'תשע"ב — מיר'),
  e('nosson-tzvi-finkel', 'noam-alon', 'inlaw', 'חתן (מיר ברכפלד)'),
  e('aryeh-finkel', 'eliezer-yehuda-finkel-2', 'teacher'),
  e('chaim-shmuelevitz', 'rafael-shmuelevitz', 'parent', 'בן'),
  e('chaim-shmuelevitz', 'nachum-partzowitz', 'inlaw', 'חתן'),
  e('chaim-shmuelevitz', 'yitzchak-ezrachi', 'inlaw', 'חתן'),
  e('nachum-partzowitz', 'asher-arieli', 'inlaw', 'חתן'),
  e('moshe-finkel', 'eliyahu-baruch-finkel', 'parent', 'בן (ענף משני)', true),
  e('chaim-zev-finkel', 'aryeh-finkel', 'parent', 'בן'),
  e('yerucham-levovitz', 'chaim-shmuelevitz', 'teacher'),
  e('yerucham-levovitz', 'yechezkel-levenstein', 'teacher'),
  e('yerucham-levovitz', 'kaplan-mir', 'inlaw', 'חתן'),

  // ====================================================================
  // סלבודקא ב"ב
  // ====================================================================
  e('isaac-sher', 'mordechai-shulman', 'inlaw', 'חתן (חיה מרים)'),
  e('mordechai-shulman', 'avigail-shulman', 'parent', 'בת'),
  e('avigail-shulman', 'moshe-hillel-hirsch', 'spouse'),
  e('mordechai-shulman', 'moshe-hillel-hirsch', 'inlaw', 'חתן (השדכן: ר\' אהרן קוטלר!)'),
  e('mordechai-shulman', 'amram-zaks', 'inlaw', 'חתן'),
  e('mordechai-shulman', 'nosson-tzvi-shulman', 'parent', 'בן'),
  e('avraham-grodzinski', 'baruch-rosenberg', 'inlaw', 'חתן'),
  e('avraham-grodzinski', 'shlomo-wolbe', 'inlaw', 'חתן'),
  e('isaac-sher', 'mordechai-shulman', 'succession', 'תשי"ב — סלבודקא'),
  e('mordechai-shulman', 'nosson-tzvi-shulman', 'succession', 'תשמ"ב — סלבודקא'),
  e('mordechai-shulman', 'amram-zaks', 'succession', 'תשמ"ב — סלבודקא'),

  // ר' דב לנדו — נין ר' אייזיק שר
  e('isaac-sher', 'dov-landau', 'inlaw', 'נשוי לנינתו אדינה'),

  // ====================================================================
  // פוניבז' / שך / אדלשטיין / שטיינמן / קניבסקי / אלישיב
  // ====================================================================
  e('isser-zalman-meltzer', 'shach', 'inlaw', 'חתן אחות'),
  e('yechezkel-levenstein', 'shach', 'teacher'),
  e('yerucham-levovitz', 'david-povarsky', 'teacher'),
  e('isser-zalman-meltzer', 'david-povarsky', 'teacher'),
  e('eliyahu-dessler', 'dov-landau', 'teacher'),
  e('david-povarsky', 'baruch-dov-povarsky', 'parent', 'בן'),
  e('david-povarsky', 'baruch-dov-povarsky', 'succession', 'פוניבז\''),
  e('shach', 'shach-1', 'parent', 'בת'),
  e('shach-1', 'meir-tzvi-bergman', 'spouse'),
  e('shach', 'meir-tzvi-bergman', 'inlaw', 'חתן'),
  e('gershon-edelstein', 'david-levi', 'inlaw', 'חתן (מאירה)'),
  e('gershon-edelstein', 'david-levi', 'succession', 'סיוון תשפ"ג — פוניבז\''),
  e('chazon-ish', 'steipler', 'spouse', 'גיסים — מרים אחות החזו"א אשת הסטייפלר'),
  e('steipler', 'chaim-kanievsky', 'parent', 'בן'),
  e('eliashiv', 'batsheva-kanievsky', 'parent', 'בת'),
  e('batsheva-kanievsky', 'chaim-kanievsky', 'spouse', 'השדכן: החזון איש'),
  e('eliashiv', 'chaim-kanievsky', 'inlaw', 'חתן'),
  e('eliashiv', 'zilberstein', 'inlaw', 'חתן'),
  e('chaim-kanievsky', 'chana-kanievsky-steinmann', 'parent', 'בת'),
  e('chana-kanievsky-steinmann', 'shraga-steinmann', 'spouse'),
  e('chaim-kanievsky', 'shraga-steinmann', 'inlaw', 'חתן (חנה)'),
  e('steinmann', 'shraga-steinmann', 'parent', 'בן'),
  e('steinmann', 'shraga-steinmann', 'succession', 'אורחות תורה'),
  e('aryeh-levin', 'eliashiv', 'inlaw', 'חתן (שיינא חיה)'),
  e('eliashiv', 'avraham-elyashiv', 'parent', 'בן'),
  e('eliashiv', 'leah-elyashiv', 'parent', 'בת'),
  e('leah-elyashiv', 'azriel-auerbach', 'spouse', 'אשה ראשונה'),
  e('avraham-elyashiv', 'mina-elyashiv', 'spouse'),
  e('mina-elyashiv', 'azriel-auerbach', 'spouse', 'אשה שנייה'),
  e('eliashiv', 'azriel-auerbach', 'inlaw', 'חתן'),

  // ====================================================================
  // אוירבך / קול תורה / פלג ירושלמי
  // ====================================================================
  e('shlomo-zalman-auerbach', 'shmuel-auerbach', 'parent', 'בן'),
  e('shlomo-zalman-auerbach', 'azriel-auerbach', 'parent', 'בן'),
  e('shmuel-auerbach', 'asher-deutsch', 'succession', 'תשע"ח — פלג'),
  e('asher-deutsch', 'azriel-auerbach', 'succession', 'תשפ"ה — פלג'),

  // ====================================================================
  // בריסק
  // ====================================================================
  e('reb-chaim-brisk', 'soloveitchik-griz', 'parent', 'בן'),
  e('soloveitchik-griz', 'meir-soloveitchik', 'parent', 'בן'),
  e('soloveitchik-griz', 'yoshe-ber', 'parent', 'בן'),
  e('yoshe-ber', 'avraham-yehoshua-soloveitchik', 'parent', 'בן'),
  e('soloveitchik-griz', 'yoshe-ber', 'succession', 'בריסק ירושלים'),
  e('avraham-yehoshua-soloveitchik', 'yad-halevi-rosh', 'inlaw', 'חתן'),
  e('baruch-dov-povarsky', 'yisrael-chaim-povarsky', 'parent', 'בן'),
  e('reb-chaim-brisk', 'baruch-bear-leibovitz', 'teacher'),

  // ====================================================================
  // קמניץ ירושלים
  // ====================================================================
  e('baruch-bear-leibovitz', 'reuven-grozovsky', 'inlaw', 'חתן (חיה שרה מרים)'),
  e('baruch-bear-leibovitz', 'moshe-bernstein', 'inlaw', 'חתן'),
  e('moshe-bernstein', 'asher-lichtenstein', 'inlaw', 'חתן'),
  e('moshe-bernstein', 'sheiner', 'inlaw', 'חתן'),
  e('moshe-bernstein', 'asher-lichtenstein', 'succession', 'קמניץ ירושלים'),
  e('moshe-bernstein', 'sheiner', 'succession', 'קמניץ ירושלים'),

  // ====================================================================
  // טלז / סורוצקין
  // ====================================================================
  e('zalman-sorotzkin', 'yitzchak-sorotzkin', 'parent', 'נכד', true),
  e('yitzchak-sorotzkin', 'sholom-ber-sorotzkin', 'parent', 'בן או נין', true),
  e('eliyahu-meir-bloch', 'goldberg-telz', 'teacher'),

  // ====================================================================
  // קרליץ ובד"ץ ב"ב
  // ====================================================================
  e('chazon-ish', 'nissim-karelitz', 'teacher', 'אחיין הקרוב'),
  e('nissim-karelitz', 'sharel-rosenberg', 'inlaw', 'חתן'),
  e('nissim-karelitz', 'sharel-rosenberg', 'succession', 'בד"ץ ב"ב 2012'),

  // ====================================================================
  // פיינשטיין
  // ====================================================================
  e('moshe-feinstein', 'david-feinstein', 'parent', 'בן'),
  e('moshe-feinstein', 'reuven-feinstein', 'parent', 'בן'),

  // ====================================================================
  // משגיחים
  // ====================================================================
  e('yechezkel-levenstein', 'chaim-friedlander', 'teacher'),
  e('eliyahu-dessler', 'chaim-friedlander', 'succession', 'משגיח פוניבז\''),
  e('yerucham-levovitz', 'kaplan-mir', 'teacher'),

  // ====================================================================
  // קישורים נוספים: לפקוביץ, רוזובסקי, פוניבז', באר יעקב
  // ====================================================================
  e('yerucham-levovitz', 'shmuel-rozovsky', 'teacher', undefined, true),
  e('chazon-ish', 'moshe-shmuel-shapira', 'teacher'),
  e('moshe-shmuel-shapira', 'hocker', 'teacher'),
  e('moshe-shmuel-shapira', 'derbarmdiger', 'teacher'),
  e('isser-zalman-meltzer', 'piltz', 'inlaw', 'חתן-נכד דרך פטשניר'),
];

