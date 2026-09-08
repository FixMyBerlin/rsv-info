import { collection, fields } from '@keystatic/core'
import { mdxComponentsKeystatic } from './components/mdxComponentsKeystatic'
import { blogSchemaFields, teaserImageField } from './posts.keystatic'

export const basePath = 'src/content/planningposts'

export const keystaticPlanningpostsConfig = collection({
  label: 'Blog Planung',
  slugField: 'title',
  path: `${basePath}/*`,
  columns: ['order', 'title'],
  format: { contentField: 'content' },
  schema: {
    ...blogSchemaFields,
    teaserImage: teaserImageField('planningposts'),
    content: fields.mdx({
      label: 'Content',
      options: { image: false },
      components: mdxComponentsKeystatic('planningposts'),
    }),
  },
})
