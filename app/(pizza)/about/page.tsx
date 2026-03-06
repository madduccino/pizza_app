import RatingBar from '@/components/RatingBar';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-10">

      {/* Header */}
      <section className="text-center py-6">
        <div className="text-5xl mb-3">🍕</div>
        <h1 className="text-4xl font-bold text-[#c0392b] mb-3">About The Foldable</h1>
        <p className="text-gray-500 text-lg">A love letter to the New York slice</p>
      </section>

      {/* The Story */}
      <section className="bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">The Story</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            The Foldable started as a simple idea: keep an honest record of every pizza slice eaten,
            so that nothing gets forgotten and no great slice goes uncelebrated.
          </p>
          <p>
            Every New Yorker has opinions about pizza. But opinions fade. The memory of an exceptional
            slice from a Tuesday afternoon three years ago — the way the crust crackled, how the sauce
            hit the back of your tongue — deserves to be preserved.
          </p>
          <p>
            This is that record. No PR, no hype, no paid placements. Just honest assessments from
            someone who has eaten a lot of pizza and thought carefully about every bite.
          </p>
          <p>
            The name? A perfectly made New York slice folds in half lengthwise. It&apos;s the move.
            If a slice can&apos;t fold without cracking or flopping, it fails a fundamental test.
            Foldability isn&apos;t just a metric — it&apos;s a philosophy.
          </p>
        </div>
      </section>

      {/* Rating System */}
      <section className="bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">The Rating System</h2>
        <p className="text-gray-500 mb-6">
          Every slice is scored across four categories, each out of 5 points. Scores are based on
          consistency — a great slice on one visit and a terrible one on the next will average out.
        </p>

        <div className="space-y-6">
          <div className="border-l-4 border-[#c0392b] pl-5">
            <h3 className="font-bold text-gray-800 text-lg">🫓 Dough / Crust</h3>
            <p className="text-gray-600 text-sm mt-1">
              The foundation of everything. We look at texture (crispy exterior, airy interior),
              chew, char, and flavor. A great crust has character — it can stand alone. A bad crust
              ruins everything else no matter how good the toppings are.
            </p>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-bold text-green-600">5</span> — Perfection. Char, chew, and crunch in harmony.
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-bold text-yellow-600">3</span> — Serviceable but forgettable.
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-bold text-red-600">1</span> — Soggy, dense, or flavorless.
              </div>
            </div>
          </div>

          <div className="border-l-4 border-orange-500 pl-5">
            <h3 className="font-bold text-gray-800 text-lg">🍅 Sauce</h3>
            <p className="text-gray-600 text-sm mt-1">
              Sauce is the soul. Is it tangy? Sweet? Bright? Herby? We judge on balance, freshness,
              and application — too much sauce and you have soup, too little and it&apos;s a desert.
              For white slices, sauce is N/A and doesn&apos;t count against the score.
            </p>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-bold text-green-600">5</span> — Bright, balanced, unforgettable.
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-bold text-yellow-600">3</span> — Fine. Does its job.
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-bold text-red-600">1</span> — Overpowering, metallic, or canned tasting.
              </div>
            </div>
          </div>

          <div className="border-l-4 border-yellow-400 pl-5">
            <h3 className="font-bold text-gray-800 text-lg">🧀 Cheese</h3>
            <p className="text-gray-600 text-sm mt-1">
              Mozzarella quality, melt, pull, and distribution. Low-moisture whole milk mozzarella
              is the gold standard. We look for even coverage, proper browning, and that satisfying
              stretch when you take a bite.
            </p>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-bold text-green-600">5</span> — Perfect melt, golden spots, incredible pull.
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-bold text-yellow-600">3</span> — Standard. Nothing to complain about.
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-bold text-red-600">1</span> — Rubber, burnt, or barely there.
              </div>
            </div>
          </div>

          <div className="border-l-4 border-green-500 pl-5">
            <h3 className="font-bold text-gray-800 text-lg">🗂️ Foldability</h3>
            <p className="text-gray-600 text-sm mt-1">
              The namesake. A true New York slice should fold cleanly down the middle without
              cracking or flopping. The fold concentrates the flavors, makes it portable, and is
              simply the correct way to eat a slice. Thick Sicilian squares get a modified grading
              scale since they aren&apos;t meant to fold.
            </p>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-bold text-green-600">5</span> — Folds like a dream. Stays folded.
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-bold text-yellow-600">3</span> — Folds but with effort or slight cracking.
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-bold text-red-600">1</span> — Snaps in half or flops open immediately.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example scores */}
      <section className="bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">What the Numbers Mean</h2>
        <p className="text-gray-500 mb-6">A rough guide to interpreting overall scores.</p>
        <div className="space-y-3">
          {[
            { label: 'Legendary (4.5–5.0)', score: 5, desc: 'Worth a special trip. Will be remembered.' },
            { label: 'Excellent (4.0–4.4)', score: 4, desc: 'Very good. Go out of your way for it.' },
            { label: 'Good (3.5–3.9)', score: 3.5, desc: 'Solid slice. Worth it if nearby.' },
            { label: 'Average (3.0–3.4)', score: 3, desc: 'Fine. Does the job when hungry.' },
            { label: 'Below Average (<3.0)', score: 2, desc: 'Pass if you have another option.' },
          ].map(({ label, score, desc }) => (
            <div key={label} className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                  score >= 4.5 ? 'bg-green-600' : score >= 4 ? 'bg-green-500' : score >= 3.5 ? 'bg-yellow-500' : score >= 3 ? 'bg-orange-400' : 'bg-red-500'
                }`}
              >
                {score.toFixed(1)}
              </div>
              <div>
                <div className="font-semibold text-gray-800 text-sm">{label}</div>
                <div className="text-gray-500 text-xs">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Consistency note */}
      <section className="bg-[#fef2f2] border border-red-200 rounded-2xl p-6">
        <h3 className="font-bold text-[#c0392b] mb-2">A Note on Consistency</h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          A single visit doesn&apos;t define a shop. Multiple visits are averaged to arrive at a shop&apos;s
          true rating. A place that consistently delivers a 4.2 is more valuable than one that hits
          5.0 once and 2.5 the next. Consistency is the mark of a truly great pizza operation.
        </p>
      </section>

    </div>
  );
}
