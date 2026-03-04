import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'exhibition',
  title: 'Выставки',
  type: 'document',
  icon: () => '🏛️',
  fields: [
    defineField({
      name: 'title',
      title: 'Название выставки',
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
      name: 'coverImage',
      title: 'Обложка',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'startDate',
      title: 'Дата начала',
      type: 'date',
      options: { dateFormat: 'DD.MM.YYYY' },
    }),
    defineField({
      name: 'endDate',
      title: 'Дата окончания',
      type: 'date',
      options: { dateFormat: 'DD.MM.YYYY' },
    }),
    defineField({
      name: 'location',
      title: 'Место проведения',
      type: 'string',
      description: 'Например: Основной зал / COSMOSCOW / ЦСИ Винзавод',
    }),
    defineField({
      name: 'status',
      title: 'Статус',
      type: 'string',
      options: {
        list: [
          { title: '🔜 Предстоящая', value: 'upcoming' },
          { title: '✅ Текущая',     value: 'current' },
          { title: '✔️ Завершена',   value: 'past' },
        ],
        layout: 'radio',
      },
      initialValue: 'upcoming',
    }),
    defineField({
      name: 'description',
      title: 'Описание',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'featuredArtworks',
      title: 'Работы на выставке',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'artwork' } }],
    }),
    defineField({
      name: 'artists',
      title: 'Участвующие художники',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'artist' } }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      startDate: 'startDate',
      media: 'coverImage',
      status: 'status',
    },
    prepare({ title, startDate, media, status }) {
      const badge = status === 'current' ? '✅ ' : status === 'upcoming' ? '🔜 ' : '✔️ '
      const date  = startDate ? new Date(startDate).toLocaleDateString('ru-RU') : ''
      return { title: badge + title, subtitle: date, media }
    },
  },
})
