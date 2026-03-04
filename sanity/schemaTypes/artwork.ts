import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'artwork',
  title: 'Работы',
  type: 'document',
  icon: () => '🖼️',
  fields: [
    defineField({
      name: 'title',
      title: 'Название работы',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL (slug)',
      type: 'slug',
      description: 'Генерируется автоматически из названия',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'artist',
      title: 'Художник',
      type: 'reference',
      to: { type: 'artist' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Главное фото',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Дополнительные фото',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'price',
      title: 'Цена (₽)',
      type: 'number',
    }),
    defineField({
      name: 'dimensions',
      title: 'Размер (например: 120 × 100 см)',
      type: 'string',
    }),
    defineField({
      name: 'medium',
      title: 'Техника (например: Холст, масло)',
      type: 'string',
    }),
    defineField({
      name: 'year',
      title: 'Год создания',
      type: 'number',
    }),
    defineField({
      name: 'status',
      title: 'Статус',
      type: 'string',
      options: {
        list: [
          { title: '✅ В наличии', value: 'available' },
          { title: '🔴 Продано',   value: 'sold' },
          { title: '🟡 Забронировано', value: 'reserved' },
        ],
        layout: 'radio',
      },
      initialValue: 'available',
    }),
    defineField({
      name: 'description',
      title: 'Описание работы',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      artist: 'artist.name',
      media: 'mainImage',
      status: 'status',
    },
    prepare({ title, artist, media, status }) {
      const badge = status === 'sold' ? ' 🔴' : status === 'reserved' ? ' 🟡' : ''
      return { title: title + badge, subtitle: artist, media }
    },
  },
  orderings: [
    { title: 'Название А–Я', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
    { title: 'Новые первые', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] },
  ],
})
