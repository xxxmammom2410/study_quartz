import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { i18n } from "../i18n"

const PreviousNext: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  const currentSlug = fileData.slug

  // 親フォルダを取得（例: "notes/sub/post" → "notes/sub"）
  const getParentDir = (slug: string) => slug.split("/").slice(0, -1).join("/") || ""

  const parentDir = getParentDir(currentSlug)

  // 同じフォルダのページをすべて抽出（フォルダのindexページも含む）
  let siblings = allFiles.filter((f) => {
    return getParentDir(f.slug) === parentDir
  })

  // タイトルでソート（frontmatter.title がなければslugの最終部分を使用）
  siblings.sort((a, b) => {
    const titleA = (a.frontmatter?.title ?? a.slug.split("/").pop() ?? "").toLowerCase()
    const titleB = (b.frontmatter?.title ?? b.slug.split("/").pop() ?? "").toLowerCase()
    return titleA.localeCompare(titleB, undefined, { sensitivity: "base" })
  })

  // 現在のページの位置を特定
  const currentIndex = siblings.findIndex((f) => f.slug === currentSlug)
  if (currentIndex === -1 || siblings.length <= 1) {
    return null // ページが1つしかない or 見つからない場合は非表示
  }

  const prevPage = currentIndex > 0 ? siblings[currentIndex - 1] : undefined
  const nextPage = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : undefined

  if (!prevPage && !nextPage) return null

  return (
    <nav className="previous-next-nav">
      <div className="nav-container">
        {prevPage && (
          <a href={`/${prevPage.slug}`} className="prev-link">
            ← {i18n("component.previousNext.prev")} <-:{" "}
            {prevPage.frontmatter?.title ?? prevPage.slug.split("/").pop() ?? prevPage.slug}
          </a>
        )}
        {nextPage && (
          <a href={`/${nextPage.slug}`} className="next-link">
            {i18n("component.previousNext.next")} :->{" "}
            {nextPage.frontmatter?.title ?? nextPage.slug.split("/").pop() ?? nextPage.slug} →
          </a>
        )}
      </div>
    </nav>
  )
}

PreviousNext.css = `
  .previous-next-nav {
    margin: 3rem 0 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--light-border);
  }
  .nav-container {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .prev-link, .next-link {
    display: inline-flex;
    align-items: center;
    padding: 0.75rem 1.25rem;
    border: 1px solid var(--light-border);
    border-radius: 0.5rem;
    text-decoration: none;
    color: var(--text);
    font-weight: 500;
    transition: all 0.2s ease;
  }
  .prev-link:hover, .next-link:hover {
    border-color: var(--primary);
    color: var(--primary);
  }
  @media (max-width: 600px) {
    .nav-container {
      flex-direction: column;
    }
  }
`

export default (() => PreviousNext) satisfies QuartzComponentConstructor
