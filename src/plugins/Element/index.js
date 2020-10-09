import Vue from 'vue'
import {
  // Button,
  // Table,
  // TableColumn,
  Message,
  Form,
  FormItem,
  Input,
  InputFixed,
  // InputNumber,
  // Checkbox,
  // CheckboxButton,
  // CheckboxGroup,
  Popover,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Tooltip,
  // Badge,
  // Dialog,
  // Row,
  // Col,
  // Pagination,
  // Radio,
  // RadioGroup,
  // RadioButton,
  // Rate,
  // Tree,
  // Select,
  // Option,
  // OptionGroup,
  // DatePicker,
  // Dropdown,
  // DropdownItem,
  // DropdownMenu,
  // Tag,
  Loading,
  // Drawer,
  // Tabs,
  // TabPane,
  // Timeline,
  // TimelineItem,
  MessageBox,
  // Transfer,
  // Slider,
  // Progress,
  // Cascader,
  // CascaderPanel,
  // Card,
  // ColorPicker,
  // Container,
  // Aside,
  // Main,
  // Avatar,
  // Steps,
  // Step,
  // Switch,
  // Popconfirm,
  Notification
  // Carousel,
  // CarouselItem,
  // Divider,
  // Collapse,
  // CollapseItem,
  // InfiniteScroll,
  // Upload,
  // Breadcrumb,
  // BreadcrumbItem
} from 'element-ui'

// Vue.component('Button', Button)
// Vue.component('Table', Table)
// Vue.component('TableColumn', TableColumn)
Vue.component('Message', Message)
Vue.component('Form', Form)
Vue.component('FormItem', FormItem)
// Vue.component('Input', Input)
Vue.component('ElInputExtend', InputFixed)
Vue.component('ElInput', Input)
// Vue.component('InputNumber', InputNumber)
// Vue.component('Checkbox', Checkbox)
// Vue.component('CheckboxButton', CheckboxButton)
// Vue.component('CheckboxGroup', CheckboxGroup)
Vue.component('Poptip', Popover)
Vue.component('Menu', Menu)
Vue.component('Submenu', Submenu)
Vue.component('MenuItem', MenuItem)
Vue.component('MenuItemGroup', MenuItemGroup)
Vue.component('Tooltip', Tooltip)
// Vue.component('Badge', Badge)
// Vue.component('Modal', Dialog)
// Vue.component('Row', Row)
// Vue.component('Col', Col)
// Vue.component('ElCol', Col)
// Vue.component('Page', Pagination)
// Vue.component('Radio', Radio)
// Vue.component('RadioGroup', RadioGroup)
// Vue.component('RadioButton', RadioButton)
// Vue.component('Rate', Rate)
// Vue.component('Tree', Tree)
// Vue.component('Select', Select)
// Vue.component('Option', Option)
// Vue.component('OptionGroup', OptionGroup)
// Vue.component('DatePicker', DatePicker)
// Vue.component('Dropdown', Dropdown)
// Vue.component('DropdownItem', DropdownItem)
// Vue.component('DropdownMenu', DropdownMenu)
// Vue.component('Tag', Tag)
// Vue.component('Drawer', Drawer)
// Vue.component('Tabs', Tabs)
// Vue.component('TabPane', TabPane)
// Vue.component('Timeline', Timeline)
// Vue.component('TimelineItem', TimelineItem)
// Vue.component('MessageBox', MessageBox)
// Vue.component('Transfer', Transfer)
// Vue.component('Slider', Slider)
// Vue.component('Progress', Progress)
// Vue.component('Cascader', Cascader)
// Vue.component('CascaderPanel', CascaderPanel)
// Vue.component('Card', Card)
// Vue.component('ColorPicker', ColorPicker)
// Vue.component('Container', Container)
// Vue.component('Sider', Aside)
// Vue.component('Main', Main)
// Vue.component('Avatar', Avatar)
// Vue.component('Steps', Steps)
// Vue.component('Step', Step)
// Vue.component('Popconfirm', Popconfirm)
// Vue.component('Carousel', Carousel)
// Vue.component('CarouselItem', CarouselItem)
// Vue.component('Divider', Divider)
// Vue.component('Collapse', Collapse)
// Vue.component('CollapseItem', CollapseItem)
// Vue.component('Upload', Upload)
// Vue.component('Breadcrumb', Breadcrumb)
// Vue.component('BreadcrumbItem', BreadcrumbItem)

// Vue.use(Switch) // Vue 规定的保留 HTML Tag , 不能直接像别的组件一样注册成 Switch , 要用 el-switch
// Vue.use(Loading.directive)
// Vue.use(InfiniteScroll)

Vue.prototype.$Message = Message
Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$Notice = Notification
