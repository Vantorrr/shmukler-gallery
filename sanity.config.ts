'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schemaTypes'

export default defineConfig({
  basePath: '/studio',
  projectId: projectId || '',
  dataset: dataset || '',
  schema,
  title: 'Shmukler Gallery — Админ',

  plugins: [
    structureTool({
      title: 'Контент',
      structure: (S) =>
        S.list()
          .title('Shmukler Gallery')
          .items([
            S.listItem()
              .title('📢 Анонсы')
              .child(
                S.documentList()
                  .title('Анонсы')
                  .filter('_type == "announcement"')
                  .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
              ),

            S.divider(),

            S.listItem()
              .title('🖼️ Работы')
              .child(
                S.documentList()
                  .title('Все работы')
                  .filter('_type == "artwork"')
                  .defaultOrdering([{ field: 'title', direction: 'asc' }])
              ),

            S.listItem()
              .title('👤 Художники')
              .child(
                S.documentList()
                  .title('Художники')
                  .filter('_type == "artist"')
                  .defaultOrdering([{ field: 'name', direction: 'asc' }])
              ),

            S.divider(),

            S.listItem()
              .title('🏛️ Выставки')
              .child(
                S.documentList()
                  .title('Выставки')
                  .filter('_type == "exhibition"')
                  .defaultOrdering([{ field: 'startDate', direction: 'desc' }])
              ),

            S.listItem()
              .title('📅 Мероприятия')
              .child(
                S.documentList()
                  .title('Мероприятия')
                  .filter('_type == "event"')
                  .defaultOrdering([{ field: 'date', direction: 'desc' }])
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
