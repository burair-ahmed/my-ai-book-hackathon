import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'introduction',
      label: 'Introduction'
    },
    {
      type: 'category',
      label: 'Chapter 1: Foundations',
      items: [
        'chapter-01/index',
        'chapter-01/embodied-cognition',
        'chapter-01/sensorimotor-integration',
        'chapter-01/physical-constraints',
        'chapter-01/chapter-summary'
      ]
    },
    {
      type: 'category',
      label: 'Chapter 2: ROS 2',
      items: [
        'chapter-02/index',
        'chapter-02/ros2-architecture',
        'chapter-02/node-communication'
      ]
    },
    {
      type: 'category',
      label: 'Chapter 3: Simulation',
      items: [
        'chapter-03/index',
        'chapter-03/gazebo-integration'
      ]
    },
    {
      type: 'category',
      label: 'Chapter 4: NVIDIA Isaac',
      items: [
        'chapter-04/index',
        'chapter-04/isaac-sim-integration'
      ]
    },
    {
      type: 'category',
      label: 'Chapter 5: Autonomous Systems',
      items: [
        'chapter-05/index',
        'chapter-05/multi-modal-integration'
      ]
    },
    {
      type: 'category',
      label: 'Appendices',
      items: [
        'appendices/glossary',
        'appendices/mathematical-foundations',
        'appendices/hardware-references'
      ]
    }
  ],
};

export default sidebars;
