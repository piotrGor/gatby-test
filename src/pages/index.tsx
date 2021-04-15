import * as React from "react"
import {Link, graphql, PageProps} from "gatsby"
import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
const cr = require('../lib/ContentRenderer');

interface IDataProps {
    site: {
      siteMetadata: {
        title: string;
      };
    };
    allArticle: {
      edges: {
        node: {
          id: string;
          content: {
            [k: string]: {
              name: string;
              subtitle: string;
              title: string;
              teaser: {
                text: string;
                title: string;
              }
            }
          }
          pictures: {
            main : string;
          }
        }
      }[]
    }

}

const BlogIndex: React.FC<PageProps<IDataProps>> = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const {ContentRenderer} = cr
  const contentRenderer = new ContentRenderer();

  console.log(data.allArticle);

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All articles" />
      <Bio />
      <ol style={{ listStyle: `none` }}>
        {data.allArticle && data.allArticle.edges.map(a => {
          const post = a.node;
          console.log(`/en/article${post.id}`);

          return (
            <li key={post.content.en.name}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                  
                    <Link to={`/en/article${post.id}`} itemProp="url">
                      <span itemProp="headline">{contentRenderer.render(post.content.en.teaser.title)}</span>
                    </Link>
                  </h2>
                </header>
                <img src={post.pictures.main} alt={post.content.en.title} width={300}/>
                <section>
                  <p itemProp="description">
                  {contentRenderer.render(post.content.en.teaser.text)}
                  </p>
                </section>
              </article>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allArticle(limit: 5) {
      edges {
        node {
          id
          content {
            en {
              name
              subtitle
              title
              teaser {
                text
                title
              }
            }
          }
          pictures {
            main 
          }
        }
      }
    }
  }
`
