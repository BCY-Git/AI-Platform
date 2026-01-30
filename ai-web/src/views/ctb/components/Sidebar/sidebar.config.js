import {
  Eleme, Odometer, Cpu, Clock, Star, Setting,
  Document, Brush, TrendCharts, Van
} from '@element-plus/icons-vue'

export const organizations = [
  { name: 'Acme Inc', role: 'Enterprise', icon: Eleme },
  { name: 'Acme Corp', role: 'Startup', icon: Odometer },
  { name: 'Evil Corp', role: 'Free', icon: Cpu },
]

export const platformMainItems = [
  { 
    title: 'CTB儒释道通信', 
    icon: Odometer, 
    path: '/ctb/playground',
    openWindow: true,
    windowFeatures: 'width=1200,height=800,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes'
  },
  { title: '需求管理模块', icon: Clock, path: '/ctb/history' },
  { title: '任务管理模块', icon: Star, path: '/ctb/starred' },
  { title: '质量保障模块', icon: Setting, path: '/ctb/settings', permission: 'sys:settings:view' },
]

export const platformSubItems = [
  // {
  //   title: 'Models',
  //   icon: Cpu,
  //   isOpen: false,
  //   children: [
  //     { title: 'Genesis', path: '/ctb/models/genesis' },
  //     { title: 'Explorer', path: '/ctb/models/explorer' },
  //     { title: 'Quantum', path: '/ctb/models/quantum' }
  //   ]
  // },
  {
    title: 'Documentation',
    icon: Document,
    isOpen: false,
    children: [
      { title: 'Introduction', path: '/ctb/documentation/introduction' },
      { title: 'Get Started', path: '/ctb/documentation/get-started' },
      { title: 'Tutorials', path: '/ctb/documentation/tutorials' }
    ]
  },
  {
    title: 'API',
    icon: Setting,
    isOpen: false,
    children: [
      { title: 'Keys', path: '/ctb/api/keys' },
      { title: 'Webhooks', path: '/ctb/api/webhooks' },
      { title: 'Usage', path: '/ctb/api/usage' }
    ]
  },
]

export const projectItems = [
  { title: 'Design Engineering', icon: Brush, path: '/ctb/design-engineering' },
  { title: 'Sales & Marketing', icon: TrendCharts, path: '/ctb/sales-marketing' },
  { title: 'AI工作流', icon: Van, path: '/ctb/ai-workflow' },
]
