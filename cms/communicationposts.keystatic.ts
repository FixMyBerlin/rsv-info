import { collection, fields } from '@keystatic/core'
import { mdxComponentsKeystatic } from './components/mdxComponentsKeystatic'
import { blogSchemaFields, teaserImageField } from './posts.keystatic'

export const basePath = 'src/content/communicationposts'

export const keystaticCommunicationpostsConfig = collection({
  label: 'Blog Kommunikation',
  slugField: 'title',
  path: `${basePath}/*`,
  columns: ['order', 'title'],
  format: { contentField: 'content' },
  schema: {
    ...blogSchemaFields,
    teaserImage: teaserImageField('communicationposts'),
    content: fields.mdx({
      label: 'Content',
      options: { image: false },
      components: mdxComponentsKeystatic('communicationposts'),
    }),
  },
})
