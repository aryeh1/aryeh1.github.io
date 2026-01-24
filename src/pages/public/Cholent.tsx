import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

// Base ratios per 1 liter of pot volume (derived from 4.5L recipe)
const BASE_RATIOS = {
  meat: 1000 / 4.5,
  onion: 3 / 4.5,
  beans: 1 / 4.5,
  barley: 0.5 / 4.5,
  potatoes: 4 / 4.5,
  eggs: 5 / 4.5,
  paprika: 1 / 4.5,
  pepper: 1 / 4.5,
  salt: 0.75 / 4.5,
  silan: 0.75 / 4.5,
  soup: 0.75 / 4.5,
} as const;

function calculateQuantities(liters: number) {
  return {
    meat: Math.round((liters * BASE_RATIOS.meat) / 100) * 100,
    onion: Math.round(liters * BASE_RATIOS.onion),
    beans: (liters * BASE_RATIOS.beans).toFixed(1),
    barley: (liters * BASE_RATIOS.barley).toFixed(1),
    potatoes: Math.round(liters * BASE_RATIOS.potatoes),
    eggs: Math.round(liters * BASE_RATIOS.eggs),
    paprika: (liters * BASE_RATIOS.paprika).toFixed(1),
    pepper: (liters * BASE_RATIOS.pepper).toFixed(1),
    salt: (liters * BASE_RATIOS.salt).toFixed(1),
    silan: (liters * BASE_RATIOS.silan).toFixed(1),
    soup: (liters * BASE_RATIOS.soup).toFixed(1),
  };
}

interface IngredientRowProps {
  label: string;
  quantity: string | number;
  unit: string;
  muted?: boolean;
}

function IngredientRow({ label, quantity, unit, muted }: IngredientRowProps) {
  return (
    <li className={`flex justify-between ${muted ? 'opacity-60' : ''}`}>
      <span>{label}</span>
      <span className={muted ? '' : 'font-bold'}>
        {quantity} {unit}
      </span>
    </li>
  );
}

interface StepProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

function Step({ number, title, children }: StepProps) {
  return (
    <div className="flex gap-4">
      <div className="text-[var(--accent)] font-bold text-xl">{number}</div>
      <div>
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <div className="text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)]">
          {children}
        </div>
      </div>
    </div>
  );
}

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
}

function InfoCard({ title, children }: InfoCardProps) {
  return (
    <div className="bg-[var(--bg-card)] dark:bg-[var(--bg-dark-card)] p-5 rounded-lg">
      <h4 className="font-bold mb-2">{title}</h4>
      <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)]">
        {children}
      </p>
    </div>
  );
}

export function Cholent() {
  const [potSize, setPotSize] = useState(4.5);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPotSize(parseFloat(e.target.value));
  }, []);

  const quantities = useMemo(() => calculateQuantities(potSize), [potSize]);

  return (
    <main className="min-h-screen" dir="rtl">
      {/* Hero Section */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-20 px-6 text-center border-b border-[var(--border)] dark:border-[var(--border-dark)]"
      >
        <div className="max-w-4xl mx-auto">
          <span className="text-[var(--accent)] tracking-widest text-sm font-bold uppercase mb-4 block">
            המדריך השלם
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight font-serif-he">
            הצ'ונט הליטאי
          </h1>
          <p className="text-xl text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] max-w-2xl mx-auto font-light">
            בצל שרוף, בשר מס' 8, הרבה פלפל שחור ומינימום מתיקות.
            מדריך טכני לבישול ארוך בתנור.
          </p>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Calculator Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--bg-alt)] dark:bg-[var(--bg-dark-alt)] border border-[var(--border)] dark:border-[var(--border-dark)] rounded-2xl p-8 mb-16"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl mb-2 font-serif-he">מחשבון הסיר</h2>
              <p className="text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] text-sm">
                הזז את המכוון לפי נפח הסיר שלך כדי לקבל כמויות מדויקות
              </p>
            </div>
            <div className="text-center bg-[var(--bg-card)] dark:bg-[var(--bg-dark-card)] px-6 py-3 rounded-xl border border-[var(--border)] dark:border-[var(--border-dark)]">
              <span className="block text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] mb-1">
                נפח הסיר
              </span>
              <span className="text-3xl font-bold text-[var(--accent)]">{potSize}</span>
              <span className="text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)] mr-1">ליטר</span>
            </div>
          </div>

          <div className="mb-10">
            <input
              type="range"
              min="3"
              max="10"
              step="0.5"
              value={potSize}
              onChange={handleSliderChange}
              className="w-full h-2 bg-[var(--border)] dark:bg-[var(--border-dark)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
            />
            <div className="flex justify-between text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] mt-2">
              <span>3 ליטר</span>
              <span>6.5 ליטר</span>
              <span>10 ליטר</span>
            </div>
          </div>

          {/* Ingredients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Solids */}
            <div>
              <h3 className="text-[var(--accent)] text-sm font-bold uppercase tracking-wider mb-4 border-b border-[var(--border)] dark:border-[var(--border-dark)] pb-2">
                המוצקים
              </h3>
              <ul className="space-y-3">
                <IngredientRow label="בשר שריר (מס' 8)" quantity={quantities.meat} unit="גרם" />
                <IngredientRow label="בצל (לטיגון עמוק)" quantity={quantities.onion} unit="יחידות" />
                <IngredientRow label="תערובת שעועית (מושרית)" quantity={quantities.beans} unit="כוסות" />
                <IngredientRow label="גריסי פנינה (שטופים)" quantity={quantities.barley} unit="כוסות" />
                <IngredientRow label="תפוחי אדמה (דזירה)" quantity={quantities.potatoes} unit="יחידות" />
                <IngredientRow label="ביצים קשות" quantity={quantities.eggs} unit="יחידות" />
              </ul>
            </div>

            {/* Seasoning */}
            <div>
              <h3 className="text-[var(--accent)] text-sm font-bold uppercase tracking-wider mb-4 border-b border-[var(--border)] dark:border-[var(--border-dark)] pb-2">
                תיבול ותוספות
              </h3>
              <ul className="space-y-3">
                <IngredientRow label="פפריקה מתוקה בשמן" quantity={quantities.paprika} unit="כף" />
                <IngredientRow label="פלפל שחור גרוס" quantity={quantities.pepper} unit="כפית גדושה" />
                <IngredientRow label="מלח" quantity={quantities.salt} unit="כף" />
                <IngredientRow label="סילאן" quantity={quantities.silan} unit="כף" />
                <IngredientRow label="אבקת מרק (אופציונלי)" quantity={quantities.soup} unit="כף" muted />
                <li className="mt-4 pt-4 border-t border-[var(--border)] dark:border-[var(--border-dark)] text-sm text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] italic">
                  + ראש שום שלם, 2-3 תמרים.
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Method Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-12"
        >
          <div className="md:grid md:grid-cols-12 gap-8">
            <div className="md:col-span-4 mb-6 md:mb-0">
              <h2 className="text-3xl mb-4 font-serif-he">הנדסת הסיר</h2>
              <p className="text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] text-sm leading-relaxed">
                בסיר 4.5 ליטר אין מקום לטעויות. שיטת השכבות קריטית כדי שכל רכיב יקבל את היחס הנכון בין נוזלים לחום.
              </p>
            </div>
            <div className="md:col-span-8 space-y-6">
              <Step number="01" title="בסיס כהה">
                <p>טיגון הבצל עד סף שריפה. הוספת פפריקה לשמן החם ל-30 שניות בלבד לפתיחת צבע.</p>
              </Step>
              <Step number="02" title="יציקת השכבות">
                <p>
                  1. תחתית: קטניות (שעועית וגריסים).<br />
                  2. מרכז: בשר, ביצים קשות, ראש שום, תמרים.<br />
                  3. עליון: תפוחי אדמה וקישקע (אם יש).<br />
                  <span className="text-[var(--accent)] text-sm">חשוב: בסיר קטן יש לנער את הסיר לחלחול המים.</span>
                </p>
              </Step>
              <Step number="03" title="קו המים">
                <p>
                  כיסוי מוחלט של הבשר והקטניות. תפוחי האדמה יכולים לבלוט מעט.
                  השארת מרווח ביטחון של 1.5 ס"מ משפת הסיר.
                </p>
              </Step>
            </div>
          </div>

          {/* Oven Logic */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[var(--bg-alt)] dark:bg-[var(--bg-dark-alt)] border border-[var(--accent)]/20 rounded-xl p-8 mt-12"
          >
            <h2 className="text-2xl mb-6 font-serif-he">המעבר לתנור (הדלתא)</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <InfoCard title="אטימה כפולה">
                חובה: נייר אפייה + רדיד אלומיניום מהודק מתחת למכסה. התנור מייבש, האדים חייבים להישאר בפנים.
              </InfoCard>
              <InfoCard title="טמפרטורה">
                20 דקות ראשונות על 200 מעלות (מכת חום). לאחר מכן 110 מעלות קבוע לכל הלילה (מצב אפייה רגיל, לא טורבו).
              </InfoCard>
              <InfoCard title="בישול מקדים">
                מומלץ לבשל 2-3 שעות על הגז. חובה לבדוק מים ולהשלים לרתיחה שניה לפני האיטום והכניסה לתנור.
              </InfoCard>
            </div>
          </motion.div>
        </motion.section>

        {/* Footer */}
        <footer className="text-center py-12 mt-12 text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] text-sm border-t border-[var(--border)] dark:border-[var(--border-dark)]">
          <p>נבנה על בסיס שיחה על טעמים, יחסים ומה שביניהם.</p>
        </footer>
      </div>
    </main>
  );
}
