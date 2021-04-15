const path = require(`path`)
const fetch = require(`node-fetch`)

const lang = ["en", "de", "ja"];

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post2.js`)
  const result = await graphql(
    `
      {
        allArticle(
          sort: { fields: [publicationDate], order: ASC }
          limit: 1000
        ) {
          nodes {
            assetId
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  lang.map(async lang => {
    const articles = result.data.allArticle.nodes
  
    if (articles.length > 0) {
        articles.forEach((article, index) => {
        const previousPostId = index === 0 ? null : articles[index - 1].assetId.toString()
        const nextPostId = index === articles.length - 1 ? null : articles[index + 1].assetId.toString()
  
        createPage({
          path: `${lang}/article${article.assetId.toString()}`,
          component: blogPost,
          context: {
            lang,
            id: `${article.assetId}`,
            previousPostId: index === 0 ? null : articles[index - 1].assetId.toString(),
            nextPostId: index === articles.length - 1 ? null : articles[index + 1].assetId.toString(),
          },
        })
      })
    }
  })
}

// exports.createSchemaCustomization = ({ actions }) => {
//   const { createTypes } = actions

//   createTypes(`
//     type SiteSiteMetadata {
//       author: Author
//       siteUrl: String
//       social: Social
//     }

//     type Author {
//       name: String
//       summary: String
//     }

//     type Social {
//       twitter: String
//     }

//     type MarkdownRemark implements Node {
//       frontmatter: Frontmatter
//       fields: Fields
//     }

//     type Frontmatter {
//       title: String
//       description: String
//       date: Date @dateformat
//     }

//     type Fields {
//       slug: String
//     }
//   `)
// }

exports.sourceNodes = async ({
  actions: {createNode},
  createContentDigest,
}) => {
  const result = await fetch(`https://babo-de-01.demo.censhare.com/hcms/v1.5/entity`)
  const resultData = await result.json()
  const article = await fetch(resultData.article.link)
  const articleResultData = await article.json()
  articleResultData.result.forEach((article) => {
    const nodeContent = JSON.stringify(article)
    const nodeMeta = {
      id: article.assetId.toString(),
      localUrl: `article${article.assetId.toString()}`,
      parent: null,
      children: [],
      internal: {
        type: `Article`,
        content: nodeContent,
        contentDigest: createContentDigest(article),
      },
    }
    const node = Object.assign({}, article, nodeMeta)
    createNode(node);
  })
}