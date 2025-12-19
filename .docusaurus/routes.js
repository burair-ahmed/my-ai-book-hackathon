import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/my-ai-book-hackathon/',
    component: ComponentCreator('/my-ai-book-hackathon/', 'ebb'),
    routes: [
      {
        path: '/my-ai-book-hackathon/',
        component: ComponentCreator('/my-ai-book-hackathon/', '690'),
        routes: [
          {
            path: '/my-ai-book-hackathon/',
            component: ComponentCreator('/my-ai-book-hackathon/', '448'),
            routes: [
              {
                path: '/my-ai-book-hackathon/appendices/glossary',
                component: ComponentCreator('/my-ai-book-hackathon/appendices/glossary', '4d1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/appendices/hardware-references',
                component: ComponentCreator('/my-ai-book-hackathon/appendices/hardware-references', 'fab'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/appendices/mathematical-foundations',
                component: ComponentCreator('/my-ai-book-hackathon/appendices/mathematical-foundations', '6f9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/chapter-01/',
                component: ComponentCreator('/my-ai-book-hackathon/chapter-01/', '1c9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/chapter-01/chapter-summary',
                component: ComponentCreator('/my-ai-book-hackathon/chapter-01/chapter-summary', '5ea'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/chapter-01/embodied-cognition',
                component: ComponentCreator('/my-ai-book-hackathon/chapter-01/embodied-cognition', '226'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/chapter-01/physical-constraints',
                component: ComponentCreator('/my-ai-book-hackathon/chapter-01/physical-constraints', '783'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/chapter-01/sensorimotor-integration',
                component: ComponentCreator('/my-ai-book-hackathon/chapter-01/sensorimotor-integration', 'cf6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/chapter-02/',
                component: ComponentCreator('/my-ai-book-hackathon/chapter-02/', '31a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/chapter-02/node-communication',
                component: ComponentCreator('/my-ai-book-hackathon/chapter-02/node-communication', '19b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/chapter-02/ros2-architecture',
                component: ComponentCreator('/my-ai-book-hackathon/chapter-02/ros2-architecture', '1e7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/chapter-03/',
                component: ComponentCreator('/my-ai-book-hackathon/chapter-03/', 'd5b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/chapter-03/gazebo-integration',
                component: ComponentCreator('/my-ai-book-hackathon/chapter-03/gazebo-integration', '71a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/chapter-04/',
                component: ComponentCreator('/my-ai-book-hackathon/chapter-04/', '822'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/chapter-04/isaac-sim-integration',
                component: ComponentCreator('/my-ai-book-hackathon/chapter-04/isaac-sim-integration', 'fd2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/chapter-05/',
                component: ComponentCreator('/my-ai-book-hackathon/chapter-05/', '946'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/chapter-05/multi-modal-integration',
                component: ComponentCreator('/my-ai-book-hackathon/chapter-05/multi-modal-integration', '0c2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/introduction',
                component: ComponentCreator('/my-ai-book-hackathon/introduction', '4ba'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/',
                component: ComponentCreator('/my-ai-book-hackathon/', '14f'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
