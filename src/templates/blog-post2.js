import * as React from "react"
import { Link, graphql, navigate  } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
const cr = require('../lib/ContentRenderer');

const BlogPostTemplate = (props) => {
  const {data, location, pageContext} = props
  const {ContentRenderer} = cr
  const contentRenderer = new ContentRenderer();
  const {previous, next, article} = data

  return (
    <Layout location={location} title="censhare">
      <SEO title={article.content[pageContext.lang].title} />
      <select value={pageContext.lang} name="select" onChange={(e) => {navigate(`/${e.target.value}/article${data.article.id}`)}}>
        {["en", "de", "ja"].map((n) => (<option key={n} value={n} >{n}</option>))}
      </select>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{article.content[pageContext.lang].title}</h1>
          <h3 itemProp="headline">{data.article.content[pageContext.lang].subtitle}</h3>
        </header>
        {contentRenderer.render(article.content[pageContext.lang].richText)}
        <hr />
        <footer>
          <Bio />
        </footer>
      </article>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={`/${pageContext.lang}/article${previous.id}`} rel="prev">
                ← {previous.content[pageContext.lang].title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={`/${pageContext.lang}/article${next.id}`} rel="next">
                {next.content[pageContext.lang].title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query ArticleByApi(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    article(id: { eq: $id }) {
      id
      content {
        en {
          name
          subtitle
          title
          richText
        }
        ja {
          name
          subtitle
          title
          richText
        }
        de {
          name
          subtitle
          title
          richText
        }
      }
      pictures {
        main 
      }
    }
    previous: article(id: { eq: $previousPostId }) {
      id
      content {
        en {
          name
          subtitle
          title

        }
        ja {
          name
          subtitle
          title
          richText
        }
        de {
          name
          subtitle
          title
          richText
        }
      }
    }
    next: article(id: { eq: $nextPostId }) {
      id
      content {
        en {
          name
          subtitle
          title
        }
        ja {
          name
          subtitle
          title
          richText
        }
        de {
          name
          subtitle
          title
          richText
        }
      }
    }
  }
`
