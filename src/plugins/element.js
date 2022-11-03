import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  Message,
  Container,
  Header,
  Footer,
  Aside,
  Main,
  MenuItem,
  Menu,
  Submenu,
  Row,
  Col,
  Card,
  Descriptions,
  DescriptionsItem,
  Tooltip,
  MessageBox,
  Notification,
  Drawer,
  Dialog,
  Table,
  TableColumn
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(Container)
Vue.use(Header)
Vue.use(Footer)
Vue.use(Aside)
Vue.use(Main)
Vue.use(MenuItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Descriptions)
Vue.use(DescriptionsItem)
Vue.use(Tooltip)
Vue.use(Drawer)
Vue.use(Dialog)
Vue.use(Table)
Vue.use(TableColumn)
// 全局挂载
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$notify = Notification
