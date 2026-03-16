import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'artist',
  title: 'Artist',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'portrait',
      title: 'Portrait',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'cv',
      title: 'CV / Exhibitions',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'portrait',
    },
  },
})
