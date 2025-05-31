import type { GatsbyConfig } from 'gatsby'

const config: GatsbyConfig = {
  siteMetadata: {
    title: `${process.env.GATSBY_HOME_PAGE_TITLE}`,
    siteUrl: `${process.env.GATSBY_WEB_ROOT_URL}`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    'gatsby-plugin-postcss',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: `${process.env.GATSBY_HOME_PAGE_TITLE}`,
        short_name: `${process.env.GATSBY_HOME_PAGE_TITLE}`,
        start_url: `/`,
        display: `standalone`,
        icon: `src/static/icon.jpg`,
      },
    },
    {
      resolve: 'gatsby-plugin-google-gtag',
      options: {
        trackingIds: ['G-110TZYN4K8'],
        pluginConfig: {
          head: true,
        },
      },
    },
    // {
    //   resolve: `gatsby-plugin-create-client-paths`,
    //   options: { prefixes: [`/*`] },
    // },
    // {
    //   resolve: `gatsby-plugin-webfonts`,
    //   options: {
    //     fonts: {
    //       google: [
    //         {
    //           family: `Calistoga`,
    //           variants: [`400`],
    //         },
    //         {
    //           family: `Oi`,
    //           variants: [`400`],
    //         },
    //         {
    //           family: `Inter`,
    //           variants: [`400`, `600`, `700`],
    //         },
    //       ],
    //     },
    //   },
    // },
  ],
}

export default config
