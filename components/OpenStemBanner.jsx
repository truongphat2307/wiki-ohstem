export default function OpenStemBanner({
    href = 'https://openstem.vn',
    title = 'Học lập trình cùng OpenSTEM LMS',
    description = 'Nền tảng học tập trực tuyến của OhStem: khoá học STEM, lập trình Blockly - MicroPython, bài tập và chứng nhận hoàn thành.',
    cta = 'Vào học ngay',
}) {
    return (
        <aside className="ohs-lms-banner">
            <div className="ohs-lms-banner__body">
                <span className="ohs-lms-banner__badge">OpenSTEM LMS</span>
                <p className="ohs-lms-banner__title">{title}</p>
                <p className="ohs-lms-banner__desc">{description}</p>
            </div>
            {/*
              ohs-link.js (app/layout.jsx) appends ohs_aid + utm_* to this href
              before React hydrates, so the server and client href differ on
              purpose. React keeps the decorated href in the DOM; this only
              silences the hydration warning for this element.
            */}
            <a
                className="ohs-lms-banner__cta"
                href={href}
                target="_blank"
                rel="noopener"
                suppressHydrationWarning
            >
                {cta}
                <span aria-hidden="true">→</span>
            </a>
        </aside>
    )
}
