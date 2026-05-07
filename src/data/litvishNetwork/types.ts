/**
 * Domain types for the Lithuanian Yeshiva power-network visualization.
 *
 * The graph models five kinds of relationships among rabbis and the
 * institutions they control:
 *   parent      — biological parent → child
 *   spouse      — marriage (rendered as a single edge, undirected in spirit)
 *   inlaw       — father-in-law → son-in-law shortcut, used when the
 *                 intermediate daughter is not itself a node
 *   teacher     — rebbe → talmid that became consequential
 *   succession  — institutional succession at a yeshiva (predecessor → successor)
 */

export type EdgeType = 'parent' | 'spouse' | 'inlaw' | 'teacher' | 'succession';

export type YeshivaRole =
  | 'meyased'    // מייסד
  | 'nasi'       // נשיא
  | 'rosh'       // ראש ישיבה
  | 'mashgiach'  // משגיח רוחני
  | 'ram'        // ר"מ
  | 'menahel';   // מנהל

export type BoardId =
  | 'moetzes-degel'        // מועצת גדולי התורה - דגל התורה
  | 'moetzes-aguda-il'     // מועצת גדולי התורה - אגודת ישראל ישראל
  | 'moetzes-aguda-us'     // מועצת גדולי התורה - אגודת ישראל ארה"ב
  | 'vaad-yeshivos'        // ועד הישיבות
  | 'chinuch-atzmai'       // חינוך עצמאי
  | 'pelag'                // הפלג הירושלמי - הנהגה
  | 'badatz-bb';           // בד"ץ בני ברק (קרליץ)

export interface PersonYeshivaRole {
  yeshivaId: string;
  role: YeshivaRole;
  fromYear?: number;
  toYear?: number;
}

export interface Person {
  id: string;
  /** Display name in Hebrew, with title (e.g. "ר' נתן צבי פינקל"). */
  name: string;
  /** Common nickname / pen-name (e.g. "הסבא מסלבודקא", "החזון איש"). */
  nickname?: string;
  /** Extra search aliases. */
  altNames?: string[];
  /** Latin-script transliteration to enable English-keyboard search. */
  ascii?: string;

  born?: number;
  died?: number;
  bornPlace?: string;
  diedPlace?: string;

  /** Yeshiva positions held — one Person can have several. */
  roles?: PersonYeshivaRole[];
  /** Memberships on political / halachic bodies. */
  boards?: BoardId[];

  /** 1-3 sentence Hebrew biography focusing on power/influence. */
  bio?: string;
  /** One-line answer to "why is this person on the map?" */
  significance?: string;

  /**
   * Generation distance from the root (Sabba miSlabodka = 0,
   * his children = 1, talmidim = 1 too, etc.). Used for the
   * generations layout.
   */
  generation?: number;
  /** Marquee figure — bigger node + bolder typography. */
  marquee?: boolean;

  /** Source URLs (Wikipedia, HaMichlol, news articles). */
  sources?: string[];
  /** "[לאימות]" — claim is plausible but not fully verified. */
  uncertain?: boolean;
}

export interface RelationshipEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  /** Free-text annotation, e.g. "חתן", "בן בכור", "ירש בתשמ"ב". */
  note?: string;
  uncertain?: boolean;
}

export interface Yeshiva {
  id: string;
  name: string;
  shortName?: string;
  location?: string;
  founded?: number;
  /** Optional accent color used to tint nodes affiliated with this yeshiva. */
  accent?: string;
}

export interface Board {
  id: BoardId;
  name: string;
  shortName?: string;
  description?: string;
}

export interface NetworkData {
  people: Person[];
  edges: RelationshipEdge[];
  yeshivot: Yeshiva[];
  boards: Board[];
}
