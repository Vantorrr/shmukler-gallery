import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'event',
  title: 'Мероприятия',
  type: 'document',
  icon: () => '📅',
  fields: [
    defineField({
      name: 'title',
      title: 'Название мероприятия',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL (slug)',
      type: 'slug',
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
      name: 'category',
      title: 'Категория',
      type: 'string',
      options: {
        list: [
          { title: '🎓 Онлайн-курс / мастер-класс', value: 'course' },
          { title: '🎪 Мероприятие / событие',       value: 'event' },
          { title: '🎤 Лекция / встреча',             value: 'lecture' },
          { title: '🎭 Перформанс / спектакль',       value: 'performance' },
        ],
        layout: 'radio',
      },
      initialValue: 'event',
    }),
    defineField({
      name: 'date',
      title: 'Дата',
      type: 'date',
      options: { dateFormat: 'DD.MM.YYYY' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startTime',
      title: 'Время начала (например: 19:00)',
      type: 'string',
    }),
    defineField({
      name: 'endTime',
      title: 'Время окончания (например: 21:00)',
      type: 'string',
    }),
    defineField({
      name: 'format',
      title: 'Формат',
      type: 'string',
      options: {
        list: [
          { title: '💻 Онлайн', value: 'online' },
          { title: '🏢 Офлайн', value: 'offline' },
        ],
        layout: 'radio',
      },
      initialValue: 'offline',
    }),
    defineField({
      name: 'location',
      title: 'Место проведения',
      type: 'string',
      description: 'Для офлайн-мероприятий',
    }),
    defineField({
      name: 'price',
      title: 'Стоимость (₽, 0 = бесплатно)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'description',
      title: 'Описание',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'registrationLink',
      title: 'Ссылка на регистрацию',
      type: 'url',
    }),
    defineField({
      name: 'artist',
      title: 'Художник / спикер (если есть)',
      type: 'reference',
      to: { type: 'artist' },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'coverImage',
      category: 'category',
      format: 'format',
    },
    prepare({ title, date, media, category, format }) {
      const catEmoji = category === 'course' ? '🎓' : category === 'lecture' ? '🎤' : category === 'performance' ? '🎭' : '🎪'
      const fmtEmoji = format === 'online' ? '💻' : '🏢'
      const dateStr  = date ? new Date(date).toLocaleDateString('ru-RU') : ''
      return { title: `${catEmoji} ${title}`, subtitle: `${fmtEmoji} ${dateStr}`, media }
    },
  },
  orderings: [
    { title: 'По дате (новые первые)', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
    { title: 'По дате (старые первые)', name: 'dateAsc', by: [{ field: 'date', direction: 'asc' }] },
  ],
})
