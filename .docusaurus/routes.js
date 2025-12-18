import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/my-ai-book-hackathon/__docusaurus/debug',
    component: ComponentCreator('/my-ai-book-hackathon/__docusaurus/debug', 'a96'),
    exact: true
  },
  {
    path: '/my-ai-book-hackathon/__docusaurus/debug/config',
    component: ComponentCreator('/my-ai-book-hackathon/__docusaurus/debug/config', 'eb4'),
    exact: true
  },
  {
    path: '/my-ai-book-hackathon/__docusaurus/debug/content',
    component: ComponentCreator('/my-ai-book-hackathon/__docusaurus/debug/content', '983'),
    exact: true
  },
  {
    path: '/my-ai-book-hackathon/__docusaurus/debug/globalData',
    component: ComponentCreator('/my-ai-book-hackathon/__docusaurus/debug/globalData', '051'),
    exact: true
  },
  {
    path: '/my-ai-book-hackathon/__docusaurus/debug/metadata',
    component: ComponentCreator('/my-ai-book-hackathon/__docusaurus/debug/metadata', 'e12'),
    exact: true
  },
  {
    path: '/my-ai-book-hackathon/__docusaurus/debug/registry',
    component: ComponentCreator('/my-ai-book-hackathon/__docusaurus/debug/registry', '1ce'),
    exact: true
  },
  {
    path: '/my-ai-book-hackathon/__docusaurus/debug/routes',
    component: ComponentCreator('/my-ai-book-hackathon/__docusaurus/debug/routes', 'ee1'),
    exact: true
  },
  {
    path: '/my-ai-book-hackathon/docs',
    component: ComponentCreator('/my-ai-book-hackathon/docs', 'a17'),
    routes: [
      {
        path: '/my-ai-book-hackathon/docs',
        component: ComponentCreator('/my-ai-book-hackathon/docs', '231'),
        routes: [
          {
            path: '/my-ai-book-hackathon/docs',
            component: ComponentCreator('/my-ai-book-hackathon/docs', 'd31'),
            routes: [
              {
                path: '/my-ai-book-hackathon/docs/appendices/glossary',
                component: ComponentCreator('/my-ai-book-hackathon/docs/appendices/glossary', '85e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/docs/appendices/hardware-references',
                component: ComponentCreator('/my-ai-book-hackathon/docs/appendices/hardware-references', '859'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/docs/appendices/mathematical-foundations',
                component: ComponentCreator('/my-ai-book-hackathon/docs/appendices/mathematical-foundations', '170'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/docs/chapter-01/',
                component: ComponentCreator('/my-ai-book-hackathon/docs/chapter-01/', 'bd5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/docs/chapter-01/chapter-summary',
                component: ComponentCreator('/my-ai-book-hackathon/docs/chapter-01/chapter-summary', 'e87'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/docs/chapter-01/embodied-cognition',
                component: ComponentCreator('/my-ai-book-hackathon/docs/chapter-01/embodied-cognition', '78b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/docs/chapter-01/physical-constraints',
                component: ComponentCreator('/my-ai-book-hackathon/docs/chapter-01/physical-constraints', 'a3d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/docs/chapter-01/sensorimotor-integration',
                component: ComponentCreator('/my-ai-book-hackathon/docs/chapter-01/sensorimotor-integration', '06a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/docs/chapter-02/',
                component: ComponentCreator('/my-ai-book-hackathon/docs/chapter-02/', 'f1f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/docs/chapter-02/node-communication',
                component: ComponentCreator('/my-ai-book-hackathon/docs/chapter-02/node-communication', '322'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/docs/chapter-02/ros2-architecture',
                component: ComponentCreator('/my-ai-book-hackathon/docs/chapter-02/ros2-architecture', '161'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/docs/chapter-03/',
                component: ComponentCreator('/my-ai-book-hackathon/docs/chapter-03/', '572'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/docs/chapter-03/gazebo-integration',
                component: ComponentCreator('/my-ai-book-hackathon/docs/chapter-03/gazebo-integration', 'b2e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/docs/chapter-04/',
                component: ComponentCreator('/my-ai-book-hackathon/docs/chapter-04/', '398'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/docs/chapter-04/isaac-sim-integration',
                component: ComponentCreator('/my-ai-book-hackathon/docs/chapter-04/isaac-sim-integration', '3b0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/docs/chapter-05/',
                component: ComponentCreator('/my-ai-book-hackathon/docs/chapter-05/', '5d8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/docs/chapter-05/multi-modal-integration',
                component: ComponentCreator('/my-ai-book-hackathon/docs/chapter-05/multi-modal-integration', '8c4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-ai-book-hackathon/docs/introduction',
                component: ComponentCreator('/my-ai-book-hackathon/docs/introduction', 'e27'),
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
