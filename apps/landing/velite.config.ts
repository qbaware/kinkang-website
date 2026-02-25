import { defineConfig, s } from 'velite'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'

const prettyCodeOptions = {
  theme: {
    dark: 'github-dark',
    light: 'github-light',
  },
  keepBackground: false,
}

export default defineConfig({
  root: 'src/content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    clean: true,
  },
  mdx: {
    rehypePlugins: [
      [rehypePrettyCode, prettyCodeOptions],
    ],
  },
  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, prettyCodeOptions],
    ],
  },
  collections: {
    posts: {
      name: 'Post',
      pattern: 'blog/*.mdx',
      schema: s
        .object({
          title: s.string(),
          publishDate: s.isodate().optional(),
          updateDate: s.isodate().optional(),
          draft: s.boolean().default(false),
          excerpt: s.string().optional(),
          image: s.string().optional(),
          category: s.string().optional(),
          tags: s.array(s.string()).default([]),
          author: s.string().optional(),
          body: s.mdx(),
        })
        .transform((data, { meta }) => {
          const slug = (meta.stem as string | undefined) ?? 'post'
          return {
            ...data,
            slug,
            permalink: `/blog/${slug}`,
          }
        }),
    },
    legal: {
      name: 'Legal',
      pattern: 'legal/*.mdx',
      schema: s
        .object({
          title: s.string(),
          lastUpdated: s.string(),
          body: s.mdx(),
        })
        .transform((data, { meta }) => ({
          ...data,
          slug: (meta.stem as string | undefined) ?? 'page',
        })),
    },
    docs: {
      name: 'Doc',
      pattern: 'docs/**/*.md',
      schema: s
        .object({
          title: s.string(),
          description: s.string().optional(),
          toc: s.toc(),
          body: s.markdown(),
        })
        .transform((data, { meta }) => ({
          ...data,
          // meta.path is an absolute path; strip everything up to and including /docs/
          // e.g. ".../src/content/docs/guides/connect-aws-msk.md" → "guides/connect-aws-msk"
          slug: (meta.path as string).replace(/^.*\/docs\//, '').replace(/\.md$/, ''),
        })),
    },
  },
})
